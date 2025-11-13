export async function frontendListAllContactSMS(
  token: string,
  contactId: string
) {
  const smsListRes = await fetch(`http://localhost:3000/sms/${contactId}`, {
    method: "GET",
    headers: {
      Authorization: token,
    },
  });

  const smsListDiv = document.getElementById(
    `contact-sms-list-div-${contactId}`
  );

  if (!smsListDiv) {
    console.error("Could not find smsListDiv");
    return;
  } else {
    if (smsListRes.status === 200) {
      const contactSMSList = await smsListRes.json();
      smsListDiv.innerHTML = contactSMSList
        .map(
          (sms: { message: any }) => `
        <div>
        ${sms.message}
        </div>    
        `
        )
        .join("");
    } else {
      smsListDiv.innerHTML = `<p>Inga meddelanden hittades</p>`;
      console.error("Failed to load SMS list:", await smsListRes.text());
    }
  }
}

export async function frontendSendSMS(
  token: string,
  contactId: string,
  message: string
) {
  const smsRes = await fetch("http://localhost:3000/sms/send", {
    method: "POST",
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contactId: contactId,
      message: message,
    }),
  });
  if (smsRes.status === 200) {
    frontendListAllContactSMS(token, contactId);

    const smsInput = document.getElementById(
      `contact-sms-message-input-${contactId}`
    ) as HTMLInputElement;
    if (smsInput) smsInput.value = "";
  } else {
    alert(await smsRes.text());
  }
}

export async function frontendPrankCall(token: string, contactId: string) {
  const prankCallRes = await fetch("http://localhost:3000/call/prank-call", {
    method: "POST",
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contactId: contactId,
    }),
  });
  alert(await prankCallRes.text());
  location.reload();
}
