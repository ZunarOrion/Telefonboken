import {
  frontendListAllContactSMS,
  frontendSendSMS,
  frontendPrankCall,
} from "./phone";
import { Contact } from "../../backend/types/types";

const token = localStorage.getItem("token");

if (token) {
  const contactFormDiv = document.getElementById(
    "contact-form-div"
  ) as HTMLDivElement;
  if (!contactFormDiv) {
    console.error("Could not find contact-form-div");
  } else {
  }
  contactFormDiv.innerHTML = `
    <form method="post" id="create-contact-form">
        <h3>Skapa kontakter:</h3>
        <label for="create-contact-name">Kontakts namn:</label>
        <input type="text" name="create-contact-name" id="create-contact-name" />
        <label for="create-contact-number">Kontakts nummer:</label>
        <input type="text" name="create-contact-number" id="create-contact-number" />
        <input type="submit" value="Spara Kontakt">
    </form>
    `;

  const createContactForm = document.getElementById(
    "create-contact-form"
  ) as HTMLFormElement;
  if (!createContactForm) {
    console.error("Could not find create-contact-form");
  } else {
    createContactForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const createContactName = document.querySelector<HTMLInputElement>(
        "#create-contact-name"
      );
      const createContactNumber = document.querySelector<HTMLInputElement>(
        "#create-contact-number"
      );
      if (!createContactName || !createContactNumber) return;
      const createRes = await fetch("http://localhost:3000/contacts/create", {
        method: "POST",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: createContactName.value,
          number: createContactNumber.value,
        }),
      });
      if (createRes.status === 201) {
        alert("Contact created");
        location.reload();
      } else if (createRes.status === 500) {
        alert("Something went wrong, try again");
      }
    });
  }

  const contactsDiv = document.getElementById("contacts-div");
  const contactsRes = await fetch("http://localhost:3000/contacts", {
    method: "GET",
    headers: {
      Authorization: token,
    },
  });

  if (contactsRes.status === 200) {
    const contacts = (await contactsRes.json()) as Contact[];
    if (contacts && contactsDiv) {
      contactsDiv.innerHTML += contacts
        .map(
          (contact) => `
              <div class="contact-card">
                <p class="contact-card-name">
                  Namn: <input type="text" id="contact-edit-name-input-${contact._id}" value="${contact.name}">
                </p>

                <p class="contact-card-number">
                  Nummer: <input type="text" id="contact-edit-number-input-${contact._id}" value="${contact.number}">
                </p>
                <button class="contact-edit-button" data-contact-id="${contact._id}">Ändra</button>
                <button class="contact-delete-button" data-contact-id="${contact._id}">Ta bort</button>

                <p class="contact-sms-message">
                  <textarea placeholder="Ditt meddelande" id="contact-sms-message-input-${contact._id}"></textarea>
                </p>
                <button class="contact-sms-button" data-contact-id=${contact._id}>Skicka</button>
                <button class="contact-prank-call-button" data-contact-id=${contact._id}>Prank samtal</button>
                <div id="contact-sms-list-div-${contact._id}"></div>
              </div>
            `
        )
        .join("");

      const contactEditButtons = document.querySelectorAll<HTMLButtonElement>(
        ".contact-edit-button"
      );
      contactEditButtons.forEach((button) => {
        button.addEventListener("click", async (event) => {
          event.preventDefault();
          const contactId = button.dataset.contactId;
          const contactEditNameInput = document.querySelector<HTMLInputElement>(
            `#contact-edit-name-input-${contactId}`
          );
          const contactEditNumberInput =
            document.querySelector<HTMLInputElement>(
              `#contact-edit-number-input-${contactId}`
            );
          if (!contactEditNameInput || !contactEditNumberInput) {
            console.error("Could not find NameInput and/or NumberInput");
          } else {
            const editRes = await fetch(
              `http://localhost:3000/contacts/edit/${contactId}`,
              {
                method: "PUT",
                headers: {
                  Authorization: token,
                  "content-type": "application/json",
                },
                body: JSON.stringify({
                  name: contactEditNameInput.value,
                  number: contactEditNumberInput.value,
                }),
              }
            );
            if (editRes.status === 201) {
              alert("Contact edited");
              location.reload();
            } else {
              alert(editRes.text());
            }
          }
        });
      });

      const contactDeleteButtons = document.querySelectorAll<HTMLButtonElement>(
        ".contact-delete-button"
      );
      contactDeleteButtons.forEach((button) => {
        button.addEventListener("click", async (event) => {
          event.preventDefault();
          const contactId = button.dataset.contactId;
          const deleteRes = await fetch(
            `http://localhost:3000/contacts/delete/${contactId}`,
            {
              method: "delete",
              headers: {
                Authorization: token,
                "content-type": "application/json",
              },
            }
          );
          if (deleteRes.status === 204) {
            alert("Contact deleted");
            location.reload();
          } else {
            alert(await deleteRes.text());
          }
        });
      });

      const smsButtons = document.querySelectorAll<HTMLButtonElement>(
        ".contact-sms-button"
      );

      smsButtons.forEach((button) => {
        button.addEventListener("click", async (event) => {
          event.preventDefault();

          const contactId = button.dataset.contactId;
          if (!contactId) {
            console.error("No contact sms button found");
            return;
          }

          const inputElement = document.getElementById(
            `contact-sms-message-input-${contactId}`
          ) as HTMLInputElement;
          if (!inputElement) {
            console.error(`No input found for ${contactId}`);
            return;
          }

          const smsMessage = inputElement.value;

          if (!token) {
            console.error("Token missing: could not send SMS");
            return;
          }

          try {
            await frontendSendSMS(token, contactId, smsMessage);
            console.log(`SMS sent to ${contactId}`);
            alert(`SMS sent to ${contactId}`);
          } catch (error) {
            console.error("Failed to send SMS:", error);
          }
        });
      });

      const prankCallButtons = document.querySelectorAll<HTMLButtonElement>(
        ".contact-prank-call-button"
      );

      prankCallButtons.forEach((button) => {
        button.addEventListener("click", async (event) => {
          event.preventDefault();
          const contactId = button.dataset.contactId;
          if (!contactId) {
            console.error("No contact phone call button found");
            return;
          }
          await frontendPrankCall(token, contactId);
        });
      });

      contacts.forEach((contact) => {
        frontendListAllContactSMS(token, contact._id);
      });
    } else {
      if (!contactsDiv) {
        console.error("Could not find contactsDiv");
      } else {
        contactsDiv.innerHTML = `<p>You have no contacts</p>`;
      }
    }
  }
} else {
  const phonePageContent = document.getElementById("phone-page-div");
  if (!phonePageContent) {
    console.error("Could not find phonePageContent");
  } else {
    phonePageContent.style.display = "none";
  }
}
