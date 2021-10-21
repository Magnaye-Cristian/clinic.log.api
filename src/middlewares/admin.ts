const admin = (req: any, res: any, next: any) => {
    console.log(`role ${req.people.role}`)
    if (req.people.role === 'admin' || req.people.role === 'head admin')
        return next();
    return res.status(403).send('Access Denied');

}

export default admin;