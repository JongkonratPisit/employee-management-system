import { Eye, Pencil, Trash2} from "lucide-react"

export default function EmployeeTable({ employees, onEdit, onDelete, onView }) {
  return (
    <div className="table-container">
        <table className="employee-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Department</th>
                    <th>Actions</th>
                </tr>
            </thead>

            <tbody>
                {employees.length > 0 ? (
                    employees?.map((employee) => (
                        <tr key={employee.id}>
                            <td>{employee.id}</td>
                            <td>
                                {employee.firstName} {employee.lastName}
                            </td>
                            <td>{employee.email}</td>
                            <td>{employee.phone || '-'}</td>
                            <td>{employee.company?.department || '-'}</td>
                            <td 
                                className="action-buttons">
                                <button
                                    className="btn-action btn-view"
                                    onClick={() => onView(employee)}
                                    title="View Employee">
                                        <Eye size={16}/>
                                    </button>
                                <button 
                                    className="btn-action btn-edit"
                                    onClick={() => onEdit(employee)}
                                    title="Edit Employee">
                                    <Pencil size={16}/>
                                </button>
                                <button 
                                    className="btn-action btn-delete"
                                    onClick={() => onDelete(employee)}
                                    title="Delete Employee">
                                    <Trash2 size={16}/>
                                    </button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="6">No employees found.</td>
                    </tr>
                )}
            </tbody>
        </table>
    </div>
  )
}
