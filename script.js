// Sign Up Form Submission
document.getElementById('signup-form').addEventListener('submit', function(event) {
    event.preventDefault();
    // Get form values
    var name = document.getElementById('name').value;
    var surname = document.getElementById('surname').value;
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    var confirm_password = document.getElementById('confirm-password').value;

    // Check if email already exists in local storage
    if (localStorage.getItem(email)) {
        var signupMessage = document.getElementById('signup-message');
        signupMessage.textContent = 'Email already exists. Please use a different email.';
        signupMessage.classList.add('wrong');
        // Clear form fields
        clearFormFields();
        return;
    }

    // Validate password strength
    if (!isStrongPassword(password)) {
        var signupMessage = document.getElementById('signup-message');
        signupMessage.textContent = 'Password should be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character.';
        signupMessage.classList.add('wrong');
        return;
    }

    // Check if password and confirm password match
    if (password !== confirm_password) {
        var signupMessage = document.getElementById('signup-message');
        signupMessage.textContent = 'Password and confirm password do not match.';
        signupMessage.classList.add('wrong');
        // Clear form fields
        clearFormFields();
        return;
    }

    // Save user data to local storage
    var user = {
        name: name,
        surname: surname,
        email: email,
        password: password,
        confirm_password: confirm_password
    };

    localStorage.setItem(email, JSON.stringify(user));

    // Show signup success message
    var signupMessage = document.getElementById('signup-message');
    signupMessage.textContent = 'Sign up successful! Now you can leave comment!';
    signupMessage.classList.remove('wrong');
    signupMessage.classList.add('success');

    // Clear form fields
    clearFormFields();

    function isStrongPassword(password) {
        var strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return strongPasswordRegex.test(password);
    }
});