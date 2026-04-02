const ROLES = {
    ADMIN: 'admin',
    MANAGER: 'manager',
    EMPLOYEE: 'employee',
};

const ATTENDANCE_STATUS = {
    PRESENT: 'present',
    ABSENT: 'absent',
    ON_LEAVE: 'on_leave',
    HALF_LEAVE: 'half_leave',
    HOLIDAY: 'holiday',
};

const LEAVE_TYPES= {
    CASUAL: 'casual',
    SICK: 'sick',
    EARNED: 'earned',
};

const LEAVE_STATUS = {
    PENDING: "PENDING",
    APPROVED: "approved",
    REJECTED: "rejected",
};

module.exports ={
    ROLES,
    ATTENDANCE_STATUS,
    LEAVE_TYPES,
    LEAVE_STATUS,
};