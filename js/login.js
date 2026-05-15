const loginForm =
    document.getElementById("loginForm");

loginForm.addEventListener("submit", (e) => {

    e.preventDefault();

    const email =
        document.getElementById("loginEmail").value;

    const password =
        document.getElementById("loginPassword").value;



    // get all users
    const users =
        JSON.parse(localStorage.getItem("smartBitesUsers")) || [];



    // find matching user
    const matchedUser = users.find(

        user =>

            user.email === email &&
            user.password === password

    );



    if (matchedUser) {

        // save current logged in user
        localStorage.setItem(
            "smartBitesUser",
            JSON.stringify(matchedUser)
        );



        localStorage.setItem(
            "isLoggedIn",
            "true"
        );



        alert("Login Successful!");

        window.location.href = "index.html";

    }

    else {

        alert("Invalid Email or Password");

    }

});