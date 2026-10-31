const API_URL = 'https://dummyjson.com/users'

export async function getEmployees(limit = 10, skip = 0, search = '') {
    let url

    if (search.trim()) {
        url = `${API_URL}/search?q=${encodeURIComponent(search.trim())}&limit=0`
    } else {
        url = `${API_URL}?limit=${limit}&skip=${skip}`
    }

    const response = await fetch(url)
    if (!response.ok) {
        throw new Error('Failed to fetch employees')
    }

    const data = await response.json()

    let employeeList = data.users

    if (search.trim()) {
        const keyword = search.trim().toLowerCase()

        employeeList = employeeList.filter((employee) => {
            const fullName = `${employee.frstName} ${employee.lastName}`.toLowerCase()
            const email = employee.email

            return fullName.includes(keyword) || email.includes(keyword)
        })
    }

    return {
        employees: search.trim() ? employeeList.slice(skip, skip + limit) : employeeList,
        total: search.trim() ? employeeList.length : data.total,
        skip,
        limit
    }
}

export async function createEmployee(employee) {
    const response = await fetch(`${API_URL}/add`, {
        method: 'POST',
        headers: {
            'content-Type': 'application/json',
        },
        body: JSON.stringify(employee),
    })

    if (!response.ok) {
        const errText = await response.text()

        throw new Error(`HTTP ${response.status}: ${errText || response.statusText}`)
    }

    return response.json()
}

export async function updateEmployee({ id, employee }) {
    const response = await fetch(`https://dummyjson.com/users/${id}`, {
        method: 'PUT',
        headers: {
            'content-Type': 'application/json',
        },
        body: JSON.stringify(employee),
    })

    if (!response.ok) {
        throw new Error('Failed to update employee')
    }

    return response.json()
}

export async function deleteEmployee(id) {
    const response = await fetch(`https://dummyjson.com/users/${id}`, {
        method: 'DELETE',
    })

    if (!response.ok) {
        throw new Error('Failed to delete employee')
    }

    return response.json()
}