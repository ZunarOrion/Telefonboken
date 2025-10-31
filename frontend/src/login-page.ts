export async function LoginPage () {
    const pageContent = document.querySelector('#page-content');
    if (pageContent) {
        pageContent.innerHTML = `
        <div>
            <input type="text" id="email-input" placeholder="Email"></input>
            <input type="text" id="password-input" placeholder="Password"></input>
            <button type="button" id="login-btn">Login</button>
        </div>
        <div>
            <p type="text" id="no-account-sign">Inget konto? Registrera dig!</p>
            <input type="text" id="register-email" placeholder="Email"></input>
            <input type="text" id="register-password" placeholder="Password"></input>
            <button type="button" id="make-account-btn">Skapa konto</button>
        </div>
        `;
    };
};
