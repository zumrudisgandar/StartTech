// Comment Form Submission
document.getElementById('comment-form').addEventListener('submit', function(event) {
    event.preventDefault();

    // Get form values
    var commentEmail = document.getElementById('comment-email').value;
    var commentText = document.getElementById('comment-text').value;
    // Check if user is logged in
    var user = JSON.parse(localStorage.getItem(commentEmail));
    if (!user) {
        var commentMessage = document.getElementById('comment-message');
        commentMessage.innerHTML = 'No account found. Please <a class="nav-link" href="signup.html">Sign up</a> or use correct credentials.';
        commentMessage.classList.add('wrong');
        clearFormFields();
        return;
    }

    // Save comment data to local storage
    var comment = {
        email: commentEmail,
        text: commentText,
        replies: [] // Initialize empty array for replies

    };

    // Get existing comments from local storage or initialize an empty array
    var comments = JSON.parse(localStorage.getItem('comments')) || [];

    // Add the new comment to the comments array
    comments.push(comment);

    // Save the updated comments array back to local storage
    localStorage.setItem('comments', JSON.stringify(comments));

    // Clear the comment form inputs
    document.getElementById('comment-email').value = '';
    document.getElementById('comment-text').value = '';

    // Refresh the comment section
    displayComments();
});

// Display Comments
function displayComments() {
    var comments = JSON.parse(localStorage.getItem('comments')) || [];
    var commentsList = document.getElementById('comments-list');

    // Clear existing comments
    commentsList.innerHTML = '';

    // Add each comment to the comments list
    comments.forEach(function(comment, index) {
        var li = document.createElement('li');
        li.classList.add('comment');
        // Retrieve user's name and surname based on comment's email
        var user = JSON.parse(localStorage.getItem(comment.email));
        var name = user ? user.name : 'Unknown';
        var surname = user ? user.surname : 'Unknown';
        li.innerHTML = '<div><strong>' + name + ' ' + surname + ': <br></strong>' + comment.text + '</div>';
        commentsList.appendChild(li);

        // Create a delete button for each comment
        var deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('delete-button');
        deleteButton.addEventListener('click', function() {
            deleteComment(index);
        });

        var deleteButtonContainer = document.createElement('div');
        deleteButtonContainer.classList.add('delete-button-container');
        deleteButtonContainer.appendChild(deleteButton);

        li.appendChild(deleteButtonContainer);

        // Create a reply button for each comment
        var replyButton = document.createElement('button');
        replyButton.textContent = 'Reply';
        replyButton.classList.add('reply-button');
        replyButton.addEventListener('click', function() {
            createReplyForm(index);
        });

        var replyButtonContainer = document.createElement('div');
        replyButtonContainer.classList.add('delete-button-container');
        replyButtonContainer.appendChild(replyButton);

        li.appendChild(replyButtonContainer);

        // Display reply comments if they exist
        if (comment.replies.length > 0) {
            var repliesContainer = document.createElement('ul');
            repliesContainer.classList.add('replies-container');

            comment.replies.forEach(function(reply, replyIndex) {
                var replyLi = document.createElement('li');
                replyLi.textContent = reply.text;

                var replyUser = JSON.parse(localStorage.getItem(reply.email));
                var replyName = replyUser ? replyUser.name : 'Unknown';
                var replySurname = replyUser ? replyUser.surname : 'Unknown';
                var replyAuthor = document.createElement('strong');
                replyAuthor.textContent = replyName + ' ' + replySurname + ': ';
                replyLi.insertBefore(replyAuthor, replyLi.firstChild);

                repliesContainer.appendChild(replyLi);

                // Create a delete button for each reply comment
                var replyDeleteButton = document.createElement('button');
                replyDeleteButton.textContent = 'Delete';
                replyDeleteButton.classList.add('delete-button');
                replyDeleteButton.addEventListener('click', function() {
                    deleteReply(index, replyIndex);
                });

                var replyDeleteButtonContainer = document.createElement('div');
                replyDeleteButtonContainer.classList.add('delete-button-container');
                replyDeleteButtonContainer.appendChild(replyDeleteButton);

                replyLi.appendChild(replyDeleteButtonContainer);
            });

            li.appendChild(repliesContainer);
        }
    });
}

function deleteComment(index) {
    var comments = JSON.parse(localStorage.getItem('comments')) || [];

    // Check if the index is valid
    if (index >= 0 && index < comments.length) {
        // Remove the comment at the specified index
        comments.splice(index, 1);
        // Save the updated comments array back to local storage
        localStorage.setItem('comments', JSON.stringify(comments));
        // Refresh the comment section
        displayComments();
    }
}

function deleteReply(parentCommentIndex, replyIndex) {
    var comments = JSON.parse(localStorage.getItem('comments')) || [];

    // Check if the parent comment index is valid
    if (parentCommentIndex >= 0 && parentCommentIndex < comments.length) {
        var parentComment = comments[parentCommentIndex];

        // Check if the reply index is valid for the parent comment
        if (replyIndex >= 0 && replyIndex < parentComment.replies.length) {
            // Remove the reply comment at the specified index
            parentComment.replies.splice(replyIndex, 1);
            // Save the updated comments array back to local storage
            localStorage.setItem('comments', JSON.stringify(comments));
            // Refresh the comment section
            displayComments();
        }
    }
}

// Create the reply form dynamically
function createReplyForm(commentIndex) {
    var existingReplyForm = document.getElementById('reply-form-' + commentIndex);
    if (existingReplyForm) {
        if (existingReplyForm.style.display === 'block') {
            existingReplyForm.style.display = 'none'; // Hide the existing reply form
        } else {
            existingReplyForm.style.display = 'block'; // Show the existing reply form
        }
        return;
    }

    // Create the reply form elements
    var replyForm = document.createElement('form');
    replyForm.classList.add('reply-form');
    replyForm.id = 'reply-form-' + commentIndex;

    var emailInput = document.createElement('input');
    emailInput.type = 'email';
    emailInput.placeholder = 'Enter your Email for verification';
    emailInput.required = true;

    var replyTextarea = document.createElement('textarea');
    replyTextarea.placeholder = 'Your Reply';
    replyTextarea.required = true;

    var submitButton = document.createElement('button');
    submitButton.textContent = 'Send';

    // Handle the reply form submission
    replyForm.addEventListener('submit', function(event) {
        event.preventDefault();

        var replyEmail = emailInput.value;
        var replyText = replyTextarea.value;

        // Check if the user exists in the local storage
        var user = JSON.parse(localStorage.getItem(replyEmail));
        if (!user) {
            // Check if the error message already exists
            var errorMessage = document.getElementById('error-message');
            if (!errorMessage) {
                errorMessage = document.createElement('p');
                errorMessage.id = 'error-message';
                errorMessage.textContent = 'No account found. Please sign up or use correct credentials.';
                errorMessage.classList.add('reply-message');

                // Append the error message to the relative reply section
                var replySection = document.getElementById('reply-form-' + commentIndex).parentNode;
                replySection.appendChild(errorMessage);
            }
            return;
        }

        // Get the existing comments from local storage
        var comments = JSON.parse(localStorage.getItem('comments')) || [];

        // Add the reply to the corresponding comment
        if (commentIndex >= 0 && commentIndex < comments.length) {
            var reply = {
                email: replyEmail,
                text: replyText
            };
            comments[commentIndex].replies.push(reply);

            // Save the updated comments array back to local storage
            localStorage.setItem('comments', JSON.stringify(comments));

            // Clear the reply form inputs
            emailInput.value = '';
            replyTextarea.value = '';

            // Refresh the comments section to display the new reply
            displayComments();
        }

        // Hide the reply form
        replyForm.style.display = 'none';
    });

    // Append the reply form elements to the comment
    var comment = document.getElementsByClassName('comment')[commentIndex + 1];
    var repliesContainer = comment.querySelector('.replies-container');

    if (!repliesContainer) {
        repliesContainer = document.createElement('div');
        repliesContainer.classList.add('replies-container');
        comment.appendChild(repliesContainer);
    }

    repliesContainer.appendChild(replyForm);
    replyForm.appendChild(emailInput);
    replyForm.appendChild(replyTextarea);
    replyForm.appendChild(submitButton);
}

// Initial display of comments
displayComments();