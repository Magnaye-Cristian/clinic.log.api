const admin = (req: any, res: any, next: any) => {
    if (req.people.role !== 'admin')
        return res.status(403).send('Access Denied');
    next();
}