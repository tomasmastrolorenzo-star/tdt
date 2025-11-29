# Component Specification: Admin User Management

**Category**: Dashboard / Admin  
**Priority**: Low  
**Status**: ⏳ Pending

---

## 🤖 V0 Prompt

```
Create an admin user management page with table, filters, and user actions using Next.js 14, TypeScript, Tailwind CSS, and shadcn/ui.

COMPONENT PURPOSE:
Manage all users (vendors, operators, admins): view, search, edit roles, suspend/activate accounts.

DESIGN: Dark premium theme, table-based

KEY FEATURES:
1. Users table with filters
2. Search by name/email
3. Role filter (vendor/operator/admin)
4. Status filter (active/suspended)
5. User actions (edit, suspend, delete)
6. User details modal

DATA STRUCTURE:
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  role: 'vendor' | 'operator' | 'admin';
  status: 'active' | 'suspended';
  createdAt: Date;
  lastLogin?: Date;
  totalOrders?: number;
}
```

LAYOUT:
- Search and filters row
- Users table
- Pagination
- User details/edit modal

STYLING:
- Table: Standard data table
- Role badges: Color-coded (vendor: purple, operator: blue, admin: red)
- Status badges: Green (active), Red (suspended)
- Action buttons: Icon buttons (edit, suspend, delete)

INTERACTIONS:
- Search: Real-time filter
- Filter by role/status: Update table
- Click row: Open user details
- Edit: Open edit modal
- Suspend: Confirmation, then update status
- Delete: Confirmation, then delete user
```

**Status**: Specification Complete
