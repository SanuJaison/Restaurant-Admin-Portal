const regForm = document.getElementById("regForm");

regForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const restaurantName = document.getElementById("restaurantName").value;
    const email = document.getElementById("regEmail").value;
    const password = document.getElementById("regPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const logo = document.getElementById("logoUpload").files[0];

    if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
    }

    let users = JSON.parse(localStorage.getItem("smartBitesUsers")) || [];
    const userExists = users.find(user => user.email === email);

    if (userExists) {
        alert("Email already registered");
        return;
    }

    const reader = new FileReader();
    reader.onload = function () {
        const userData = {
            restaurantName,
            email,
            password,
            logo: logo ? reader.result : ""
        };
        users.push(userData);
        localStorage.setItem("smartBitesUsers", JSON.stringify(users));
        localStorage.setItem("smartBitesUser", JSON.stringify(userData));
        localStorage.setItem("isLoggedIn", "true");
        alert("Registration Successful!");
        window.location.href = "index.html";
    };

    if (logo) {
        reader.readAsDataURL(logo);
    } else {
        reader.onload();
    }
});