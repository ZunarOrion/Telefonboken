export async function ContantsPage() {
    const pageContent = document.querySelector('#page-content');
    if (pageContent) {
        pageContent.innerHTML = `
        <div>
            <container id="contact-form">
                <input type="text" id="contact-phonenumber" placeholder="Telefonnummer"></input>
                <input type="text" id="contact-name" placeholder="Name"></input>
                <button type="button" id="contact-submit">Lägg till</button>
            </container>
            <container id="contact-list">
                <p type="text" id="contact-list-title">Kontakt lista</p>
                <li id="contacts"></li>
            </containter>
        </div>
        `;
    };
};
