import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query"
import { createEmployee, getEmployees, updateEmployee, deleteEmployee } from "./service/employeeService"
import EmployeeTable from "./components/EmployeeTable"
import EmployeeForm from "./components/EmployeeForm"
import { useState, useEffect } from "react"


function App() {
  const [searchEmployee, setSearchEmployee] = useState('')
  const [debounceSearch, setDebounceSearch] = useState('')
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('success') // 'success' or 'error'
  const [editingEmployee, setEditingEmployee] = useState(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isToastVisible, setIsToastVisible] = useState(false)
  const [employeeToDelete, setEmployeeToDelete] = useState(null)
  const [isClosingModal, setIsClosingModal] = useState(false)
  const [viewingEmployee, setViewingEmployee] = useState(null)
  const [formMode, setFormMode] = useState('add')

  const [page, setPage] = useState(1)
  const limit = 10
  const skip = (page - 1) * limit

  const queryClient = useQueryClient();

  useEffect(() => {
    if (!message) {
      return 
    }

    const hideTimer = setTimeout(() => {
      setIsToastVisible(false)
    }, 2700)

    const removeTimer = setTimeout(() => {
      setMessage('')
    }, 3000)

    return () => {
      clearTimeout(hideTimer)
      clearTimeout(removeTimer)
    }
  }, [message])

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounceSearch(searchEmployee)
      setPage(1)
    }, 800)

    return () => clearTimeout(timer)
  }, [searchEmployee, setDebounceSearch])

  const {
    data: employees,
    isLoading,
    isFetching,
    isPlaceholderData,
    error,
  } = useQuery({
    queryKey: ['employees', page, debounceSearch],
    queryFn: () => getEmployees(limit, skip, debounceSearch),
    placeholderData: (previousData) => previousData,
  })

  const totalEmployees = employees?.total ?? 0
  const totalPages = Math.ceil(totalEmployees / limit)

  function getPageNumber(currentPage, totalPages) {
    const pages = []

    if (totalPages <= 5) {
      return Array.from({ length: totalPages}, (_, index) => index + 1)
    }

    pages.push(1)

    if (currentPage > 3) {
      pages.push('...')
    }

    const startPage = Math.max(2, currentPage - 1)
    const endPage = Math.min(totalPages - 1, currentPage + 1)

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    if (currentPage < totalPages - 2) {
      pages.push('...')
    }

    pages.push(totalPages)

    return pages
  }

  const pageNumbers = getPageNumber(page, totalPages)

  const createMutation = useMutation({
    mutationFn: createEmployee,
    onSuccess: (newEmployee, variables) => {
    const createdEmployee = {
        ...variables,
        ...newEmployee,

        // Keep nested data from the submitted payload
        address: variables.address,
        company: variables.company
    }

    const cachedQueries = queryClient.getQueriesData({
        queryKey: ['employees']
    })

    cachedQueries.forEach(([queryKey, oldData]) => {
        if (!oldData?.employees) {
            return
        }

        const currentPage = queryKey[1]
        const currentSearch = (queryKey[2] ?? '').trim().toLowerCase()

        const fullName =
            `${createdEmployee.firstName} ${createdEmployee.lastName}`.toLowerCase()

        const matchesSearch =
            !currentSearch ||
            fullName.includes(currentSearch) ||
            createdEmployee.email?.toLowerCase().includes(currentSearch)

        if (!matchesSearch) {
            return
        }

        const alreadyExists = oldData.employees.some(
            (employee) => employee.id === createdEmployee.id
        )

        if (alreadyExists) {
            return
        }

        queryClient.setQueryData(queryKey, {
            ...oldData,
            employees: currentPage === 1
                ? [createdEmployee, ...oldData.employees].slice(0, oldData.limit)
                : oldData.employees,
            total: oldData.total + 1
        })
    })

    setPage(1)
    showToast('Employee added successfully!!')
    setIsFormOpen(false)
    },

    onError: () => {
      console.error('create employee error:', error)
      showToast('Failed to add employee.', 'error')
    },
  })

  const updateMutation = useMutation({
    mutationFn: updateEmployee,
    onSuccess: (updatedEmployee) => {
      console.log('Updated employee from API:', updatedEmployee)
      queryClient.setQueriesData(
        { queryKey: ['employees'] },
        (oldData) => {
          if (!oldData?.employees) {
            return oldData
          }

          return {
            ...oldData,
            employees: oldData.employees.map((employee) => {
              if (employee.id !== updatedEmployee.id) {
                return employee
              }

              return {
                ...employee,
                ...updatedEmployee,

                address: {
                  ...employee.address,
                  ...(typeof updatedEmployee.address === 'string' ? { address: updatedEmployee.address} : updatedEmployee.address ?? {})
                },
                company: {
                  ...employee.company,
                  ...(updatedEmployee.company ?? {}),
                  ...(updatedEmployee.department !== undefined ? {department: updatedEmployee.department} : {}),
                  ...(updatedEmployee.jobTitle !== undefined ? {title: updatedEmployee.jobTitle} : {})
                }
              }
            }
            )
          }
        }
      )

      setEditingEmployee(null)
      setIsFormOpen(false)
      showToast('Employee updated successfully!!')
    },

    onError: (error) => {
      console.error('update employee error:', error)
      setIsFormOpen(false)
      showToast(`Failed to update employee. Please try again.`, 'error')
    }
  })

  const deleteMutation = useMutation({
    mutationFn: deleteEmployee,

    onSuccess: (_, deletedEmployeeId) => {
      queryClient.setQueriesData(
        { queryKey: ['employees'] },
        (oldData) => {
          if (!oldData?.employees) {
            return oldData
          }

          const updatedEmployees = oldData.employees.filter(
            (employee) => employee.id !== deletedEmployeeId
          )

          const wasDeleted = updatedEmployees.length !== oldData.employees.length

          return {
            ...oldData,
            employees: updatedEmployees,
            total: wasDeleted ? Math.max(0, oldData.total - 1) : oldData.total
          }
        }
      )

      setEmployeeToDelete(null)
      showToast('Employee deleted successfully!!')
    },

    onError: (error) => {
      console.error('delete employee error:', error)

      setEmployeeToDelete(null)
      showToast(`Failed to delete employee: ${error.message}`, 'error')
    }
  })

  const confirmDelete = () => {
    if (!employeeToDelete) {
      return
    }

    deleteMutation.mutate(employeeToDelete.id)
  }

  const closeDeleteModal = () => {
    setIsClosingModal(true)

    setTimeout(() => {
      setEmployeeToDelete(null)
      setIsClosingModal(false)
    }, 200)
  }

  function handleSubmitEmployee(employee) {
    setMessage('')

    const {
        address,
        department,
        jobTitle,
        companyName,
        ...rest
    } = employee

    if (editingEmployee) {
        const employeePayload = {
            ...rest,
            address: {
                ...editingEmployee.address,
                address: address
            },
            company: {
                ...editingEmployee.company,
                department: department,
                title: jobTitle,
                name: companyName
            }
        }

        updateMutation.mutate({
            id: editingEmployee.id,
            employee: employeePayload,
        })
    } else {
        const employeePayload = {
            ...rest,
            address: {
                address: address
            },
            company: {
                department: department,
                title: jobTitle,
                name: companyName
            }
        }

        createMutation.mutate(employeePayload)
    }
  } 

  function handleEdit(employee) {
    setEditingEmployee(employee)
    setViewingEmployee(null)
    setMessage('')
    setIsFormOpen(true)
    setFormMode('edit')
  }

  function handleCancelEdit() {
    setEditingEmployee(null)
    setViewingEmployee(null)
    setFormMode('add')
    setMessage('')
    setIsFormOpen(false)
  }

  function handleDeleteEmployee(employee) {
    setEmployeeToDelete(employee)
  }

  function handleOpenForm() {
    setEditingEmployee(null)
    setViewingEmployee(null)
    setMessage('')
    setIsFormOpen(true)
    setFormMode('add')
  }

  function handleViewEmployee(employee) {
    setViewingEmployee(employee)
    setEditingEmployee(null)
    setFormMode('view')
    setMessage('')
    setIsFormOpen(true)
  }

  function showToast(message, type = 'success' ) {
    setMessage(message)
    setIsToastVisible(true)
    setMessageType(type)
  }

  if (isLoading) {
    return <p>Loading employees...</p>
  }

  if (error) {
    return <p>Error: {error.message}</p>
  }

  const employeeList = employees?.employees ?? []
  const filteredEmployees = employeeList

  function handlePreviousPage() {
    setPage(prev => Math.max(prev - 1, 1))
  }

  function handleNextPage() {
    setPage(prev => Math.min(prev + 1, totalPages))
  }

  function handlePageChange(pageNumber) {
    setPage(pageNumber)
  }

  const startItem = totalEmployees === 0 ? 0 : skip + 1
  const endItem = Math.min(skip + limit, totalEmployees)

  return (
    <main className="app-container">
      <header className="page-header">
        <p className="page-eyebrow">EMPLOYEE PORTAL</p>
        <h1>Employee Management System</h1>
        <p className="page-description">Manage your employees in one place.</p>
      </header>

      {/* Toast Message */}
      {message && (
        <div
          className={`toast-notification toast-${messageType} ${isToastVisible ? 'toast-visible' : 'toast-hidden'}`}
          role={messageType === 'error' ? 'alert' : 'status'}
        >
          <span className="toast-message">{message}</span>

          <button
            type="button"
            className="toast-close"
            onClick={() => setMessage('')}
            aria-label="Close notification"
          >
            ×
          </button>
        </div>
      )}

      {/* Pop-up */}
      {employeeToDelete && (
        <div className="modal-overlay">
          <section
            className={`delete-modal ${isClosingModal ? 'modal-closing' : ''}`}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-modal-title"
            aria-describedby="delete-modal-description"
          >
            <div className="delete-modal-icon">
              <span aria-hidden="true">!</span>
            </div>

            <h2 id="delete-modal-title"> Delete Employee?</h2>

            <p id="delete-modal-description">
              Are you sure you want to delete this employee?
              This action cannot be undone.
            </p>

            <div className="delete-employee-info">
              <strong> {employeeToDelete.firstName} {employeeToDelete.lastName}
              </strong>
                <span>{employeeToDelete.email}</span>
            </div>

            <div className="delete-modal-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={closeDeleteModal}>Cancel</button>
                <button 
                  type="button"
                  className="btn-danger"
                  onClick={confirmDelete}
                  disabled={deleteMutation.isPending}>{deleteMutation.isPending ? 'Deleting...' : 'Delete'}</button>
            </div>
            </section>
          </div>
      )}

      {
        isFormOpen ? (
          <section className="employee-form-page">
            <header className="form-page-header">
              <button
                type="button"
                className="btn-back"
                onClick={handleCancelEdit}
              >
                ← Back to Employees
              </button>

              <h1>{editingEmployee ? 'Edit Employee' : 'Add Employee'}</h1>
              <p>{editingEmployee ? 'Update employee information below.' : 'Fill out the form below to add a new employee.'}</p>
            </header>

            <EmployeeForm 
              key={`${formMode}-${(formMode === 'view' ? viewingEmployee : editingEmployee)?.id ?? 'new'}`}
              employee={formMode === 'view' ? viewingEmployee : editingEmployee}
              mode={formMode}
              onSubmit={handleSubmitEmployee}
              isSubmitting={createMutation.isPending || updateMutation?.isPending}
              onCancel={handleCancelEdit}
              onEdit={() => handleEdit(viewingEmployee)}
            />
          </section>
        ) : viewingEmployee ? (
          <section className="employee-detail-page">
            <h1>Employee Detail</h1>
            <p>{viewingEmployee.firstName} {viewingEmployee.lastName}</p>

            <button
              type="button"
              className="btn-back"
              onClick={() => setViewingEmployee(null)}>
              ← Back to Employees</button>
          </section>
        ) : (
          <section className="employee-list-page">
            <section className="employee-section">
              <div className="section-header">
                <div>
                  <h2>Employee List</h2>
                  <p>View and manage employee information.</p>
                </div>
                
              </div>

              <div className="employee-toolbar">
                <div className="search-group">
                  <input 
                    type="text" 
                    className="search-input"
                    placeholder="Search by name or email..."
                    value={searchEmployee}
                    onChange={(event) => setSearchEmployee(event.target.value)}
                  />
                </div>

                <button
                    type="button"
                    className="btn-primary"
                    onClick={handleOpenForm}
                  >
                    + Add Employee
                  </button>
              </div>

              {isFetching && (<p className="loading-indicator">Updating employees...</p>)}
          
              <EmployeeTable 
                employees={filteredEmployees}
                onEdit={handleEdit} 
                onDelete={handleDeleteEmployee}
                onView={handleViewEmployee}
              />


              <p>Showing {startItem}–{endItem} of {totalEmployees} employees</p>

              <div className="pagination">
                <button
                  onClick={handlePreviousPage}
                  disabled={page === 1}>
                    Previous
                  </button>

                  {pageNumbers.map((pageNumber, index) => (
                    pageNumber === '...' ? (
                      <span key={`ellipsis-${index}`} className="pagination-ellipsis">...</span>
                    ) : (
                      <button
                        key={pageNumber}
                        onClick={() => {handlePageChange(pageNumber)}}
                        className={page === pageNumber ? 'active' : ''}>{pageNumber}</button>
                    )
                  ))}

                  <button
                    onClick={handleNextPage}
                    disabled={page === totalPages || totalPages === 0}>
                      Next
                  </button>
              </div>
            </section>
          </section>
        )
      }
    </main>
  )
}

export default App