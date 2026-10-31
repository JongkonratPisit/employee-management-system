import { useState } from "react"

export default function EmployeeForm({ employee, onSubmit, isSubmitting, onCancel, mode, onEdit }) {
    const [formData, setFormData] = useState({
        firstName: employee?.firstName ?? '',
        lastName: employee?.lastName ?? '',
        birthDate: employee?.birthDate ?? '',
        gender: employee?.gender ?? '',
        email: employee?.email ?? '',
        phone: employee?.phone ?? '',
        address: employee?.address?.address ?? '',
        department: employee?.company?.department ?? '',
        jobTitle: employee?.company?.title ?? '',
        joinDate: employee?.joinDate ?? '',
        companyName: employee?.company?.name ?? '',
    })

    const [errors, setErrors] = useState({})
    const [touched, setTouched] = useState({})
    
    function handleChange(event) {
        const { name, value } = event.target

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))

        if(touched[name]) {
            const error = validateField(name, value)

            setErrors(prev => ({
                ...prev,
                [name]: error
            }))
        }
    }

    // Action when user move to other field
    function handleBlur(event) {
        const { name, value } = event.target

        setTouched(prev => ({
            ...prev,
            [name]: true
        }))

        const error = validateField(name, value)
        setErrors(prev => ({
            ...prev,
            [name]: error
        }))
    }

    function handleSubmit(event) {
        event.preventDefault()
        
        const newErrors = validateForm()
        setErrors(newErrors)

        const allTouched = {}

        Object.keys(formData).forEach((name) => {
            allTouched[name] = true
        })
        setTouched(allTouched)

        if (Object.keys(newErrors).length > 0) {
            return
        }

        onSubmit(formData)
    }

    function validateField(name, value) {
        let error = ''

        if(name === 'firstName' && !value.trim()) {
            error = 'First name is required.'
        }

        if (name === 'lastName' && !value.trim()) {
            error = 'Last name is required.'
        }

        if (name === 'email') {
            if (!value.trim()) {
            error = 'Email is required.'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            error = 'Please enter a valid email address.'
        }
        }

        if (name === 'gender' && !value) {
            error = 'Please select a gender.'
        }

        if (name === 'phone' && value) {
            const phone = value.replace(/-/g, '')

            if (!/^0[0-9]{9}$/.test(phone)) {
                error = 'Please enter a valid 10-digits phone number.'
            }
        }

        if (name === 'department' && !value) {
            error = 'Please select a department.'
        }

        if (name === 'jobTitle' && !value) {
            error = 'Job title is required.'
        }

        if (name === 'birthDate' && value) {
            if (new Date(value) > new Date()) {
                error = 'Birth date cannot be in the future.'
            } else if (new Date(value).toDateString() === new Date().toDateString()) {
                error = 'Birth date cannot be today.'
            }
        }

        if (name === 'joinDate' && value) {
            if (new Date(value) > new Date()) {
                error = 'Join date cannot be in a future.'
            }
        }

        if (name === 'companyName' && !value) {
            error = 'Company name is required.'
        }

        return error
    }

    function validateForm() {
        const newErrors = {}

        Object.keys(formData).forEach((name) => {
            const error = validateField(name, formData[name])

            if (error) {
                newErrors[name] = error
            }
        })

        return newErrors
    }

  return (
    <form className="employee-form" onSubmit={handleSubmit} noValidate>
        <div className="form-section">
            <h3>Personal Information</h3>
            <div className="form-grid">
                <div className="form-group">
                    <label htmlFor="firstName">First Name</label>
                    <input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={mode === 'view'}
                        className={touched.firstName && errors.firstName ? 'input-error' : ''}
                    />
                    {touched.firstName && errors.firstName && (
                        <small className="field-error">{errors.firstName}</small>
                    )}
                </div>

                <div className="form-group">
                    <label htmlFor="lastName">Last Name</label>
                    <input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={mode === 'view'}
                        className={touched.lastName && errors.lastName ? 'input-error' : ''}
                    />
                    {touched.lastName && errors.lastName && (
                        <small className="field-error">{errors.lastName}</small>
                    )}
                </div>

                <div className="form-group">
                    <label htmlFor="birthDate">Birth Date</label>
                    <input
                        type="date"
                        id="birthDate"
                        name="birthDate"
                        value={formData.birthDate}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={mode === 'view'}
                        className={touched.birthDate && errors.birthDate ? 'input-error' : ''}
                    />
                    {touched.birthDate && errors.birthDate && (
                        <small className="field-error">{errors.birthDate}</small>
                    )}
                </div>

                <div className="form-group">
                    <label htmlFor="gender">Gender</label>
                    <select
                        id="gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={mode === 'view'}
                        className={touched.gender && errors.gender ? 'input-error' : ''}
                    >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                    {touched.gender && errors.gender && (
                        <small className="field-error">{errors.gender}</small>
                    )}
                </div>
            </div>
        </div>

        <div className="form-section">
            <h3>Contact Information</h3>
            <div className="form-grid">
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input 
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={mode === 'view'}
                        className={touched.email && errors.email ? 'input-error' : ''} />
                        {touched.email && errors.email && (
                            <small className="field-error">{errors.email}</small>
                        )}
                </div>

                <div className="form-group">
                    <label htmlFor="phone">Phone Number</label>
                    <input 
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={mode === 'view'}
                        className={touched.phone && errors.phone ? 'input-error' : ''} />
                        {touched.phone && errors.phone && (
                            <small className="field-error">{errors.phone}</small>
                        )}
                </div>

                <div className="form-group form-group-full">
                    <lebel htmlFor="address">Address</lebel>
                    <textarea 
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        disabled={mode === 'view'}
                        />
                </div>
            </div>
        </div>

        <div className="form-section">
            <h3>Employment Information</h3>
            <div className="form-grid">
                <div className="form-group">
                    <label htmlFor="department">Department</label>
                    <select
                        id="department"
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={mode === 'view'}
                        className={touched.department && errors.department ? 'input-error' : ''}>
                            <option value="">Select Department</option>
                            <option value="Engineering">Engineering</option>
                            <option value="Human Resources">Human Resources</option>
                            <option value="Marketing">Marketing</option>
                            <option value="Sales">Sales</option>
                            <option value="Finance">Finance</option>
                        </select>
                        {touched.department && errors.department && (
                            <small className="field-error">{errors.department}</small>
                        )}
                </div>

                <div className="form-group">
                    <label htmlFor="jobTitle">Job Title</label>
                    <input 
                        id="jobTitle"
                        name="jobTitle"
                        value={formData.jobTitle}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={mode === 'view'}
                        className={touched.jobTitle && errors.jobTitle ? 'input-error' : ''}
                    />
                    {touched.jobTitle && errors.jobTitle && (
                        <small className="field-error">{errors.jobTitle}</small>
                    )}
                </div>

                <div className="form-group">
                    <label htmlFor="companyName">Company Name</label>
                    <input 
                        id="companyName"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={mode === 'view'}
                        className={touched.companyName && errors.companyName ? 'input-error' : ''}/>
                    
                    {touched.companyName && errors.companyName && (
                        <small className="field-error">{errors.companyName}</small>
                    )}
                </div>
            </div>
        </div>
        

        <div className="form-actions">
            {mode === 'view' ? (
                <>
                <button
                    type="button"
                    className="btn-primary"
                    onClick={onEdit}>
                        Edit Employee
                </button>
                <button
                    type="button"
                    className="btn-secondary"
                    onClick={onCancel}>
                        Back
                </button>
                </>
            ) : (
                <>
                <button
                    type="submit"
                    className="btn-primary"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Saving...' : mode === 'edit' ? 'Update Employee' : 'Add Employee'}
                </button>

                <button
                    type="button"
                    className="btn-secondary"
                    onClick={onCancel}
                    disabled={isSubmitting}>
                        Cancel
                    </button>
                </>
            )}
        </div>
    </form>
  )
}
