// Feedback Form Function to send the email
function sendEmail() {
    // Get the form values
    var firstName = document.getElementById('first-name').value;
    var lastName = document.getElementById('last-name').value;
    var email = document.getElementById('email').value;
    var message = document.getElementById('message').value;

    // Set the EmailJS user ID, service ID, and template ID
    var userID = 'jhxcXuMUdlrbo50c-';
    var serviceID = 'service_o7ao6dd';
    var templateID = 'template_yogigf1';

    // Prepare the email template parameters
    var templateParams = {
        from_name: firstName + ' ' + lastName,
        to_name: 'Your Name', // Replace with the recipient's name or leave as is
        email: email,
        message: message,
        reply_to: email // Include the sender's email as the reply-to address
    };

    // Send the email using EmailJS
    emailjs.send(serviceID, templateID, templateParams, userID)
        .then(function(response) {
            console.log('Email sent successfully!', response);
            // Clear the form inputs
            document.getElementById('first-name').value = '';
            document.getElementById('last-name').value = '';
            document.getElementById('email').value = '';
            document.getElementById('message').value = '';
            // Display a success message
            document.getElementById('success-message').style.display = 'block';
        })
        .catch(function(error) {
            console.error('Error sending email:', error);
            // Display an error message
            document.getElementById('error-message').style.display = 'block';
        });
}

// Add an event listener to the form submit button
document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault();
    // Call the sendEmail function when the form is submitted
    sendEmail();
});