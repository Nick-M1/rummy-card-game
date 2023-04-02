import { Auth, onAuthStateChanged, User } from 'firebase/auth';
import {useEffect, useState} from 'react';

export default (auth: Auth): [
    User | null | undefined,
    boolean,
    Error | undefined
] => {

    const [user, setUser] = useState<User | null | undefined>(undefined)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<Error | undefined>(undefined)

    useEffect(() => {
        const listener = onAuthStateChanged(
            auth,
            async (user) => {
                setUser(user);
                setLoading(false)
            },
            setError,
        );
        return () => listener()
    }, [auth]);

    return [user, loading, error];
};