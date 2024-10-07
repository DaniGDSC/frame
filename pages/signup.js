// signup.js
    document.addEventListener('DOMContentLoaded', () => {
        const signupForm = document.getElementById('signupForm');
        const securityKeyElement = document.getElementById('securityKey');
        const passwordInput = document.getElementById('password');
        const strengthBar = document.querySelector('.password-strength-bar');
        const strengthText = document.querySelector('.password-strength-text');

        // Generate and display the security key
        const securityKey = generateSecurityKey();
        displaySecurityKey(securityKey);

        // Initialize password strength
        updatePasswordStrength(0);

        passwordInput.addEventListener('input', () => {
            const strength = calculatePasswordStrength(passwordInput.value);
            updatePasswordStrength(strength);
        });

        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = passwordInput.value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const role = document.querySelector('input[name="role"]:checked').value;

            if (validateForm(username, password, confirmPassword)) {
                try {
                    const response = await fetch('/api/auth/signup', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ username, password, role, securityKey }),
                    });

                    if (response.ok) {
                        const data = await response.json();
                        console.log('Signup successful:', data);
                        alert('Account created successfully!');
                        window.location.href = 'login.html';
                    } else {
                        let errorMessage = 'Failed to create account';
                        try {
                            const errorData = await response.json();
                            errorMessage = errorData.message || errorMessage;
                        } catch (jsonError) {
                            console.error('Error parsing JSON:', jsonError);
                        }
                        alert(`Error: ${errorMessage}`);
                    }
                } catch (error) {
                    console.error('Error:', error);
                    alert('An error occurred while creating the account. Please try again.');
                }
            }
        });
    });
    function generateSecurityKey() {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 16; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result.match(/.{1,4}/g).join('-');
    }

    function displaySecurityKey(key) {
        const securityKeyElement = document.getElementById('securityKey');
        if (securityKeyElement) {
            securityKeyElement.textContent = key;
        } else {
            console.error('Security key element not found');
        }
    }

    function calculatePasswordStrength(password) {
        let strength = 0;
        if (password.length > 6) strength += 25;
        if (password.match(/[a-z]+/)) strength += 25;
        if (password.match(/[A-Z]+/)) strength += 25;
        if (password.match(/[0-9]+/)) strength += 25;
        if (password.match(/[$@#&!]+/)) strength += 25;
        return Math.min(100, strength);
    }

    function updatePasswordStrength(strength) {
        const strengthBar = document.querySelector('.password-strength-bar');
        const strengthText = document.querySelector('.password-strength-text');

        if (!strengthBar || !strengthText) {
            console.error('Password strength elements not found');
            return;
        }

        strengthBar.style.width = `${strength}%`;
        
        if (strength < 25) {
            strengthBar.style.backgroundColor = '#ff4d4d';
            strengthText.textContent = 'Weak';
        } else if (strength < 50) {
            strengthBar.style.backgroundColor = '#ffa64d';
            strengthText.textContent = 'Moderate';
        } else if (strength < 75) {
            strengthBar.style.backgroundColor = '#ffff4d';
            strengthText.textContent = 'Good';
        } else {
            strengthBar.style.backgroundColor = '#4dff4d';
            strengthText.textContent = 'Strong';
        }
    }

    function validateForm(username, password, confirmPassword) {
        if (username.length < 3) {
            alert('Username must be at least 3 characters long.');
            return false;
        }
        if (password.length < 8) {
            alert('Password must be at least 8 characters long.');
            return false;
        }
        if (password !== confirmPassword) {
            alert('Passwords do not match.');
            return false;
        }
        return true;
    }