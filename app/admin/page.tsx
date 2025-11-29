import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function AdminDashboard() {
    const supabase = await createClient()

    // Check if user is admin (Skip for now or implement basic check)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        redirect('/login')
    }

    // Fetch all profiles with their credits
    const { data: profiles, error } = await supabase
        .from('profiles')
        .select(`
      id,
      full_name,
      email,
      role,
      credits (
        balance
      )
    `)
        .order('created_at', { ascending: false })

    if (error) {
        return <div className="p-8 text-red-500">Error loading data: {error.message}</div>
    }

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow border">
                    <h3 className="text-gray-500 text-sm font-medium">Total Users</h3>
                    <p className="text-3xl font-bold">{profiles?.length || 0}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow border">
                    <h3 className="text-gray-500 text-sm font-medium">Total Credits Outstanding</h3>
                    <p className="text-3xl font-bold text-green-600">
                        ${profiles?.reduce((acc, profile) => acc + (profile.credits?.balance || 0), 0).toFixed(2)}
                    </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow border">
                    <h3 className="text-gray-500 text-sm font-medium">System Status</h3>
                    <div className="flex items-center mt-2">
                        <span className="h-3 w-3 bg-green-500 rounded-full mr-2"></span>
                        <span className="text-sm font-medium">Operational</span>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow border overflow-hidden">
                <div className="px-6 py-4 border-b">
                    <h2 className="text-lg font-semibold">User Management</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 font-medium text-gray-500">User</th>
                                <th className="px-6 py-3 font-medium text-gray-500">Email</th>
                                <th className="px-6 py-3 font-medium text-gray-500">Role</th>
                                <th className="px-6 py-3 font-medium text-gray-500">Balance</th>
                                <th className="px-6 py-3 font-medium text-gray-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {profiles?.map((profile) => (
                                <tr key={profile.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium">{profile.full_name || 'N/A'}</td>
                                    <td className="px-6 py-4 text-gray-500">{profile.email}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${profile.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {profile.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-green-600">
                                        ${profile.credits?.balance?.toFixed(2) || '0.00'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <button className="text-blue-600 hover:text-blue-800 font-medium text-xs">
                                            Manage Credits
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {profiles?.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                        No users found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
