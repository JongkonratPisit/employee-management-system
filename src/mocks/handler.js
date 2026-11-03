
import { http, HttpResponse } from 'msw'

const mockEmployees = [
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
    {
        id: 2,
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        phone: '089-876-5432',
        company: {
            department: 'Marketing',
        },
    },
]

export const handlers = [
    http.get('https://dummyjson.com/users', () => {
        return HttpResponse.json({
            users: mockEmployees,
            total: mockEmployees.length,
            skip: 0,
            limit: 10,
        })
    }),
]