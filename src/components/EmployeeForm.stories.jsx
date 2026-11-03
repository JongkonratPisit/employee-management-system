
import EmployeeForm from './EmployeeForm'
import { fn, expect, userEvent, within } from 'storybook/test'

const mockEmployee = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    birthDate: '1995-05-15',
    gender: 'male',
    email: 'john.doe@example.com',
    phone: '0812345678',
    address: {
        address: '123 Main Street, Bangkok',
    },
    company: {
        department: 'Engineering',
        title: 'Software Engineer',
        name: 'ABC Company',
    },
}

const meta = {
    title: 'Employee Management/EmployeeForm',
    component: EmployeeForm,
    tags: ['autodocs'],
    // parameters: {
    //     layout: 'padded',
    // },

    // decorators: [
    //     (Story) => (
    //         <div style={{ padding: '20px', background: '#f3f0ff' }}>
    //             <Story />
    //         </div>
    //     ),
    // ],

    argTypes: {
        mode: {
            control: 'select',
            options: ['add', 'edit', 'view'],
            description: 'Defines the form mode',
        },

        isSubmitting: {
            control: 'boolean',
            description: 'Indicates whether the form is submitting',
        },

        employee: {
            control: 'object',
            description: 'Employee information used to populate the form',
        },

        onSubmit: {
            description: 'Callback function called when the form is submitted with valid employee data',
        },

        onCancel: {
            description: 'Callback function called when the user clicks the Cancel or Back button',
        },

        onEdit: {
            description: 'Callback function called when the user clicks Edit Employee in view mode',
        },
    },
}

export default meta

export const Add = {
  args: {
    employee: {},
    mode: 'add',
    isSubmitting: false,
    onSubmit: fn(),
    onCancel: fn(),
  },

  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)

    await userEvent.type(
      canvas.getByLabelText('First Name'),
      'John'
    )

    await userEvent.type(
      canvas.getByLabelText('Last Name'),
      'Doe'
    )

    await userEvent.type(
      canvas.getByLabelText('Email'),
      'john.doe@example.com'
    )

    await userEvent.selectOptions(
      canvas.getByLabelText('Gender'),
      'male'
    )

    await userEvent.selectOptions(
      canvas.getByLabelText('Department'),
      'Engineering'
    )

    await userEvent.type(
      canvas.getByLabelText('Job Title'),
      'Software Engineer'
    )

    await userEvent.type(
      canvas.getByLabelText('Company Name'),
      'ABC Company'
    )

    await userEvent.click(
      canvas.getByRole('button', { name: 'Add Employee' })
    )

    await expect(args.onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        gender: 'male',
        department: 'Engineering',
        jobTitle: 'Software Engineer',
        companyName: 'ABC Company',
      })
    )
  },
}

export const Edit = {
    args: {
        employee: {
            "id": 1,
            "firstName": "John",
            "lastName": "Doe",
            "birthDate": "1995-05-15",
            "gender": "female",
            "email": "john.doe@gmail.com",
            "phone": "0812345678",

            "address": {
                "address": "123 Main Street, Bangkok"
            },

            "company": {
                "department": "Engineering",
                "title": "Software Engineer",
                "name": "ABC Company"
            }
        },
        mode: 'edit',
        isSubmitting: false,
        onSubmit: fn(),
        onCancel: fn(),
    },
    play: async ({ canvasElement, args }) => {
        const canvas = within(canvasElement)

        const firstNameInput = canvas.getByLabelText('First Name')

        // Verify existing employee data
        await expect(firstNameInput).toHaveValue('John')

        // Update first name
        await userEvent.clear(firstNameInput)
        await userEvent.type(firstNameInput, 'Johnny')

        // Submit the form
        await userEvent.click(
            canvas.getByRole('button', { name: 'Update Employee' })
        )

        // Verify submitted data
        await expect(args.onSubmit).toHaveBeenCalledWith(
            expect.objectContaining({
            firstName: 'Johnny',
            lastName: 'Doe',
            email: 'john.doe@gmail.com',
            })
        )
    },
}

export const View = {
    args: {
        employee: mockEmployee,
        mode: 'view',
        isSubmitting: false,
        onCancel: fn(),
        onEdit: fn(),
    },
}

export const Validation = {
  args: {
    employee: {},
    mode: 'add',
    isSubmitting: false,
    onSubmit: fn(),
    onCancel: fn(),
  },

  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)

    // Submit without entering any data
    await userEvent.click(
      canvas.getByRole('button', { name: 'Add Employee' })
    )

    // Verify validation messages
    await expect(
      canvas.getByText('First name is required.')
    ).toBeVisible()

    await expect(
      canvas.getByText('Last name is required.')
    ).toBeVisible()

    await expect(
      canvas.getByText('Email is required.')
    ).toBeVisible()

    await expect(
      canvas.getByText('Please select a gender.')
    ).toBeVisible()

    await expect(
      canvas.getByText('Please select a department.')
    ).toBeVisible()

    await expect(
      canvas.getByText('Job title is required.')
    ).toBeVisible()

    await expect(
      canvas.getByText('Company name is required.')
    ).toBeVisible()

    // Verify onSubmit was not called
    await expect(args.onSubmit).not.toHaveBeenCalled()
  },
}
