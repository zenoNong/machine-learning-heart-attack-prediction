class HealthPredictionForm {
    constructor() {
        this.formData = {
            age: '',
            gender: '',
            height: '',
            weight: '',
            bmi: '',
            ap_hi: '',
            ap_lo: '',
            cholesterol: 1,
            gluc: 1,
            smoke: 0,
            alco: 0,
            active: 0
        };
        this.init();
    }

    init() {
        this.render();
        this.attachEventListeners();
    }

    attachEventListeners() {
        const form = document.querySelector('form');
        form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Add other event listeners for form fields
        form.querySelectorAll('input, select').forEach(input => {
            input.addEventListener('change', (e) => this.handleChange(e));
        });
    }

    async handleSubmit(e) {
        e.preventDefault();
        try {
            const response = await fetch('/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams(this.formData)
            });

            if (response.ok) {
                // Get the response as text since it's HTML
                const resultHtml = await response.text();
                // Replace the current page content
                document.documentElement.innerHTML = resultHtml;
            } else {
                throw new Error('Prediction failed');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while processing your request');
        }
    }

    handleChange(e) {
        const { name, value } = e.target;
        this.formData[name] = value;
        
        if (name === 'height' || name === 'weight') {
            this.calculateBMI();
        }
    }

    calculateBMI() {
        if (this.formData.height && this.formData.weight) {
            const heightInMeters = this.formData.height / 100;
            this.formData.bmi = (this.formData.weight / (heightInMeters * heightInMeters)).toFixed(1);
        }
    }

    render() {
        const template = `
            <div class="form-container">
                <h1>Heart Disease Risk Assessment</h1>
                <form>
                    <div class="form-sections-grid">
                        <!-- Personal Information Section -->
                        <div class="form-section">
                            <h2>Personal Information</h2>
                            <div class="form-group">
                                <label>Age (years):</label>
                                <input
                                    type="number"
                                    name="age"
                                    value="${this.formData.age}"
                                    placeholder="Enter age"
                                    required
                                />
                            </div>
                            <div class="form-group">
                                <label>Gender:</label>
                                <select name="gender" required>
                                    <option value="">Select gender</option>
                                    <option value="1" ${this.formData.gender === '1' ? 'selected' : ''}>Male</option>
                                    <option value="2" ${this.formData.gender === '2' ? 'selected' : ''}>Female</option>
                                </select>
                            </div>
                        </div>

                        <!-- Physical Measurements Section -->
                        <div class="form-section">
                            <h2>Physical Measurements</h2>
                            <div class="form-group">
                                <label>Height (cm):</label>
                                <input
                                    type="number"
                                    name="height"
                                    value="${this.formData.height}"
                                    placeholder="Enter height"
                                    required
                                />
                            </div>
                            <div class="form-group">
                                <label>Weight (kg):</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    name="weight"
                                    value="${this.formData.weight}"
                                    placeholder="Enter weight"
                                    required
                                />
                            </div>
                            <div class="form-group">
                                <label>BMI:</label>
                                <input
                                    type="number"
                                    name="bmi"
                                    value="${this.formData.bmi}"
                                    readonly
                                    class="calculated-field"
                                />
                            </div>
                        </div>

                        <!-- Blood Pressure Section -->
                        <div class="form-section">
                            <h2>Blood Pressure</h2>
                            <div class="form-group">
                                <label>Systolic (mm Hg):</label>
                                <input
                                    type="number"
                                    name="ap_hi"
                                    value="${this.formData.ap_hi}"
                                    placeholder="Enter systolic"
                                    required
                                />
                            </div>
                            <div class="form-group">
                                <label>Diastolic (mm Hg):</label>
                                <input
                                    type="number"
                                    name="ap_lo"
                                    value="${this.formData.ap_lo}"
                                    placeholder="Enter diastolic"
                                    required
                                />
                            </div>
                        </div>

                        <!-- Lifestyle Factors Section -->
                        <div class="form-section">
                            <h2>Lifestyle Factors</h2>
                            <div class="form-group">
                                <label>Smoking:</label>
                                <select name="smoke">
                                    <option value="0" ${this.formData.smoke === '0' ? 'selected' : ''}>No</option>
                                    <option value="1" ${this.formData.smoke === '1' ? 'selected' : ''}>Yes</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Alcohol Intake:</label>
                                <select name="alco">
                                    <option value="0" ${this.formData.alco === '0' ? 'selected' : ''}>No</option>
                                    <option value="1" ${this.formData.alco === '1' ? 'selected' : ''}>Yes</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Physical Activity:</label>
                                <select name="active">
                                    <option value="0" ${this.formData.active === '0' ? 'selected' : ''}>No</option>
                                    <option value="1" ${this.formData.active === '1' ? 'selected' : ''}>Yes</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <button type="submit">Calculate Risk</button>
                </form>
            </div>
        `;

        document.getElementById('app').innerHTML = template;
    }
}

// Initialize the form
document.addEventListener('DOMContentLoaded', () => {
    new HealthPredictionForm();
}); 