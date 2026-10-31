
import EmployeeForm from './EmployeeForm'
import { fn } from 'storybook/test'

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
