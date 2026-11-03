
import EmployeeTable from './EmployeeTable'
import { fn, expect, userEvent, within } from 'storybook/test'

const meta = {
  title: 'Employee Management/EmployeeTable',
  component: EmployeeTable,
  tags: ['autodocs'],
  argTypes: {
    employees: {
      control: 'object',
      description: 'List of employees displayed in the table',
    },
    onView: { action: 'view employee' },
    onEdit: { action: 'edit employee' },
    onDelete: { action: 'delete employee' },
  },
}

export default meta

export const Default = {
  args: {
    employees: [{
      "id": 1,
      "firstName": "JohnTest",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "phone": "081-234-5678",

      "company": {
        "department": "Engineering"
      }
    }, {
      "id": 2,
      "firstName": "Jane",
      "lastName": "Smith",
      "email": "jane.smith@example.com",
      "phone": "089-876-5432",

      "company": {
        "department": "Marketing"
      }
    }],
    onView: fn(),
    onEdit: fn(),
    onDelete: fn(),
  },
}


export const Empty = {
  args: {
    employees: [],
    onView: fn(),
    onEdit: fn(),
    onDelete: fn(),
  },
}

export const ManyEmployees = {
  args: {
    employees: Array.from({ length: 10 }, (_, index) => ({
      id: index + 1,
      firstName: `Employee${index + 1}`,
      lastName: 'Test',
      email: `employee${index + 1}@example.com`,
      phone: '081-234-5678',
      company: {
        department: 'Engineering',
      },
    })),
    onView: fn(),
    onEdit: fn(),
    onDelete: fn(),
  },
}

export const ViewEmployee = {
  args: {
    employees: [
      {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '081-234-5678',
        company: {
          department: 'Engineering',
        },
      },
    ],
    onView: fn(),
    onEdit: fn(),
    onDelete: fn(),
  },

  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)

    await userEvent.click(
      canvas.getByRole('button', { name: 'View Employee' })
    )

    await expect(args.onView).toHaveBeenCalledWith(
      args.employees[0]
    )
  },
}

export const EditEmployee = {
  args: {
    employees: [
      {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '081-234-5678',
        company: {
          department: 'Engineering',
        },
      },
    ],
    onView: fn(),
    onEdit: fn(),
    onDelete: fn(),
  },

  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)

    await userEvent.click(
      canvas.getByRole('button', { name: 'Edit Employee' })
    )

    await expect(args.onEdit).toHaveBeenCalledWith(
      args.employees[0]
    )
  },
}

export const DeleteEmployee = {
  args: {
    employees: [
      {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '081-234-5678',
        company: {
          department: 'Engineering',
        },
      },
    ],
    onView: fn(),
    onEdit: fn(),
    onDelete: fn(),
  },

  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)

    await userEvent.click(
      canvas.getByRole('button', { name: 'Delete Employee' })
    )

    await expect(args.onDelete).toHaveBeenCalledWith(
      args.employees[0]
    )
  },
}