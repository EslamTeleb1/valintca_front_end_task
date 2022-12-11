hideErrors();


function validateForm() {

    const {
        email,
        pwd,
        usrName
    } = getFormData();

    var errorMsg;

    hideErrors();

    if (!validateUsrName(usrName)) {
        errorMsg = " not a correct user name format !";

        $('#usrNameError').show();

        $('#usrNameError').text(errorMsg);

    } else if (!validateEmail(email)) {
        errorMsg = "not a correct email format !";
        $('#emailError').show();
        $('#emailError').text(errorMsg);

    } else if (!valdiatePassword(pwd)) {
        errorMsg = "not a correct password length !";
        $('#pwdError').show();
        $('#pwdError').text(errorMsg);
    } else {
        sendFoemData();
    }

}


const validateUsrName = (usrName) => {

    if (!isNaN(usrName[0]) || !isNaN(usrName[usrName.length - 1] || !usrName)) {
        return false;
    }

    return true;

}

// validateEmail by regex
const validateEmail = (email) => {

    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

function valdiatePassword(pwd) {
    if (pwd.length < 8 || !pwd) {
        return false;
    }

    return true;

}

function hideErrors() {
    $('#emailError').hide();
    $('#usrNameError').hide();
    $('#pwdError').hide();
    $('#pwdConfError').hide();
}

function getFormData() {
    var email = $('#e-mail').val();
    var pwd = $('#pwd').val();
    var confirmPwd = $('#confirm_pwd').val();
    var usrName = $("[name='usrName']").val();

    return {
        email,
        pwd,
        usrName,
        confirmPwd
    }
}
//send form Date 

async function sendFoemData() {
    const {
        email,
        pwd,
        usrName,
        confirmPwd
    } = getFormData();
    const data = {
        'username': usrName,
        email: email,
        password: pwd,
        password_confirmation: confirmPwd
    };
    //console.log(data)

    await fetch('https://goldblv.com/api/hiring/tasks/register', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then((response) => response.json())
        .then((data) => {
            console.log('Success:', data);
            let pwdErrors;
            if (data.errors) {
                pwdErrors = data.errors.password
            }

            console.log(pwdErrors)

            if (pwdErrors) {
                if (pwdErrors[0].includes('confirmation')) {
                    $('#pwdConfError').show();
                    $('#pwdConfError').text(pwdErrors[0]);
                } else {
                    $('#pwdError').show();
                    $('#pwdError').text(pwdErrors[0]);
                }

                if (pwdErrors.length >= 2) {
                    $('#pwdConfError').show();
                    $('#pwdConfError').text(pwdErrors[0]);

                    $('#pwdError').show();
                    $('#pwdError').text(pwdErrors[1]);
                }

            }

            console.log("mail", data.email);
            console.log("id", data.id);
            if (data.id) {

                localStorage.setItem("usrEmail", data.email);
                // if on a host this method works :
                // window.open('/success.html');
                //if in local env this works
                window.open(window.location.href.replace('signup', 'success'));

            }

        })
        .catch((error) => {
            console.error('Error:', error);
        });
}
