const form = document.getElementById("registrationForm");

const login = document.getElementById("login");
const email = document.getElementById("email");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");
const age = document.getElementById("age");

const city = document.getElementById("city");

const agreement = document.getElementById("agreement");

const result = document.getElementById("result");



const loginMessage = document.getElementById("loginMessage");
const emailMessage = document.getElementById("emailMessage");
const passwordMessage = document.getElementById("passwordMessage");
const confirmMessage = document.getElementById("confirmMessage");
const ageMessage = document.getElementById("ageMessage");
const genderMessage = document.getElementById("genderMessage");
const cityMessage = document.getElementById("cityMessage");
const agreementMessage = document.getElementById("agreementMessage");



function showMessage(element, message, isValid) {

    element.textContent = message;

    if (isValid) {
        element.className = "valid";
    } else {
        element.className = "invalid";
    }
}



function validateLogin() {

    const value = login.value.trim();

    if (value.length < 3) {

        showMessage(
            loginMessage,
            "Логин должен содержать минимум 3 символа.",
            false
        );

        return false;

    } else {

        showMessage(
            loginMessage,
            "Логин корректный.",
            true
        );

        return true;
    }
}



function validateEmail() {

    const value = email.value.trim();

    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(value)) {

        showMessage(
            emailMessage,
            "Введите корректный e-mail.",
            false
        );

        return false;

    } else {

        showMessage(
            emailMessage,
            "E-mail корректный.",
            true
        );

        return true;
    }
}



function validatePassword() {

    const value = password.value;

    if (value.length < 6) {

        showMessage(
            passwordMessage,
            "Пароль должен содержать минимум 6 символов.",
            false
        );

        return false;
    }

    if (!/[A-Z]/.test(value)) {

        showMessage(
            passwordMessage,
            "Добавьте хотя бы одну заглавную букву.",
            false
        );

        return false;
    }

    if (!/[0-9]/.test(value)) {

        showMessage(
            passwordMessage,
            "Добавьте хотя бы одну цифру.",
            false
        );

        return false;
    }

    showMessage(
        passwordMessage,
        "Пароль корректный.",
        true
    );

    return true;
}



function validateConfirmPassword() {

    if (
        confirmPassword.value === "" ||
        confirmPassword.value !== password.value
    ) {

        showMessage(
            confirmMessage,
            "Пароли не совпадают.",
            false
        );

        return false;

    } else {

        showMessage(
            confirmMessage,
            "Пароли совпадают.",
            true
        );

        return true;
    }
}



function validateAge() {

    const value = Number(age.value);

    if (value < 14 || value > 100 || age.value === "") {

        showMessage(
            ageMessage,
            "Возраст должен быть от 14 до 100 лет.",
            false
        );

        return false;

    } else {

        showMessage(
            ageMessage,
            "Возраст корректный.",
            true
        );

        return true;
    }
}



function validateGender() {

    const gender =
        document.querySelector(
            'input[name="gender"]:checked'
        );

    if (!gender) {

        showMessage(
            genderMessage,
            "Выберите пол.",
            false
        );

        return false;

    } else {

        showMessage(
            genderMessage,
            "Пол выбран.",
            true
        );

        return true;
    }
}



function validateCity() {

    if (city.value === "") {

        showMessage(
            cityMessage,
            "Выберите город.",
            false
        );

        return false;

    } else {

        showMessage(
            cityMessage,
            "Город выбран.",
            true
        );

        return true;
    }
}



function validateAgreement() {

    if (!agreement.checked) {

        showMessage(
            agreementMessage,
            "Необходимо согласиться с правилами.",
            false
        );

        return false;

    } else {

        showMessage(
            agreementMessage,
            "Согласие подтверждено.",
            true
        );

        return true;
    }
}



login.addEventListener("input", validateLogin);

email.addEventListener("input", validateEmail);

password.addEventListener("input", function () {

    validatePassword();


    if (confirmPassword.value !== "") {
        validateConfirmPassword();
    }

});

confirmPassword.addEventListener(
    "input",
    validateConfirmPassword
);

age.addEventListener("input", validateAge);

city.addEventListener("change", validateCity);

agreement.addEventListener("change", validateAgreement);



form.addEventListener("submit", function (event) {


    event.preventDefault();



    const isLoginValid = validateLogin();

    const isEmailValid = validateEmail();

    const isPasswordValid = validatePassword();

    const isConfirmValid = validateConfirmPassword();

    const isAgeValid = validateAge();

    const isGenderValid = validateGender();

    const isCityValid = validateCity();

    const isAgreementValid = validateAgreement();



    if (
        isLoginValid &&
        isEmailValid &&
        isPasswordValid &&
        isConfirmValid &&
        isAgeValid &&
        isGenderValid &&
        isCityValid &&
        isAgreementValid
    ) {


        const gender =
            document.querySelector(
                'input[name="gender"]:checked'
            );


        result.className = "success";

        result.innerHTML = `
            <strong>Регистрация успешно проверена!</strong>
            <br><br>

            Логин: ${login.value}
            <br>

            E-mail: ${email.value}
            <br>

            Возраст: ${age.value}
            <br>

            Пол: ${gender.value}
            <br>

            Город: ${city.value}
        `;

    } else {

        result.className = "error";

        result.textContent =
            "Исправьте ошибки в форме.";
    }

});
