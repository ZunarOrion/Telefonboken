const token = localStorage.getItem("token");

if (!token) {
  const signupFormDiv = document.getElementById("signup-form-div");
  if (!signupFormDiv) {
    console.error("Could not find signupFormDiv");
  } else {
    signupFormDiv.innerHTML = `
        <h1>Skapa konto</h1>
        <form method="post" id="signup-form">
            <label for="signup-email">Email</label>
            <input type="email" name="signup-email" id="signup-email" required />
            <label for="signup-password">Lösenord</label>
            <input type="password" name="signup-password" id="signup-password" required />
            <input type="submit" value="Skapa" />
        </form>
        `;
  }
  const signupForm = document.getElementById(
    "signup-form"
  ) as HTMLFormElement | null;
  signupForm?.addEventListener("submit", async (e: SubmitEvent) => {
    e.preventDefault();
    const email = document.querySelector<HTMLInputElement>("#signup-email");
    const password =
      document.querySelector<HTMLInputElement>("#signup-password");

    if (!email || !password) {
      alert("Both fields must be filled out");
      return;
    }

    try {
      const signupRes = await fetch("http://localhost:3000/signup", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          email: email.value,
          password: password.value,
        }),
      });
      if (signupRes.ok) {
        const token = await signupRes.text();
        localStorage.setItem("token", token);
        location.reload();
      } else {
        alert(await signupRes.text());
      }
    } catch (err) {
      console.error("Signup failed:", err);
      alert("Cloud not reach the server.");
    }
  });

  const loginFormDiv = document.getElementById("login-form-div");
  if (!loginFormDiv) {
    console.error("Could not find loginFormDiv");
  } else {
    loginFormDiv.innerHTML = `
        <h1>Logga in</h1>
        <form action="post" id="login-form">
            <label for="login-email">Email</label>
            <input type="email" name="login-email" id="login-email" required />
            <label for="login-password">Lösenord</label> 
            <input type="password" name="login-password" id="login-password" required />
            <input type="submit" value="Logga in" />
        </form>
        `;
  }
  const loginForm = document.getElementById(
    "login-form"
  ) as HTMLFormElement | null;
  loginForm?.addEventListener("submit", async (e: SubmitEvent) => {
    e.preventDefault();
    const email = document.querySelector<HTMLInputElement>("#login-email");
    const password =
      document.querySelector<HTMLInputElement>("#login-password");

    if (!email || !password) {
      alert("Both fields must be filled");
      return;
    }

    try {
      const loginRes = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          email: email.value,
          password: password.value,
        }),
      });
      if (loginRes.ok) {
        const token = await loginRes.text();
        localStorage.setItem("token", token);
        location.reload();
      } else {
        alert(await loginRes.text());
      }
    } catch (err) {
      console.error("Login failed:", err);
      alert("Could not reach the server.");
    }
  });
} else {
  const logoutButtonDiv = document.getElementById("logout-button-div");
  if (!logoutButtonDiv) {
    console.error("Could not find logoutButtonDiv");
  } else {
    logoutButtonDiv.innerHTML = `
          <button type="button" id="logout-button">Logout</button>
          `;
    const logoutButton = document.getElementById(
      "logout-button"
    ) as HTMLButtonElement | null;
    logoutButton?.addEventListener("click", () => {
      localStorage.removeItem("token");
      location.reload();
    });
  }
}
