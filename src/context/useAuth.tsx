import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getToken, refreshAccessToken, validateAccessToken } from "../services/tokenService";
import axios from "axios";
import { User } from "../interfaces/models/User";

type UserContextType = {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    isTokenValid: () => Promise<boolean>;
    isLoggedIn: () => Promise<boolean>;
}

type Props = { children: React.ReactNode };

const UserContext = createContext<UserContextType>({} as UserContextType);

export const UserProvider = ({ children }: Props) => {    
    const navigate = useNavigate();
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');        

        if (accessToken && refreshToken) {
            setAccessToken(accessToken);
            setRefreshToken(refreshToken);
            const tokenParts: string[] = accessToken.split('.');

            if (tokenParts.length >= 2) {
                const payload = JSON.parse(atob(tokenParts[1]));

                const id: number = payload.user_id || 0;
                const username: string = payload.username || '';
                const firstName: string = payload.first_name || '';
                const lastName: string = payload.last_name || '';
                const isStaff: boolean = payload.is_staff || false;

                const user: User = {
                    id: id,
                    username: username,
                    firstName: firstName,
                    lastName: lastName,
                    isStaff: isStaff
                };

                setUser(user);
            }
            axios.defaults.headers.common["Authorization"] = "Bearer " + accessToken;
        }

        setIsReady(true);
    }, [])

    const login = async (username: string, password: string): Promise<void> => {
        const res = await getToken({ username, password });
        if (res) {
            localStorage.setItem('accessToken', res?.access);
            localStorage.setItem('refreshToken', res?.refresh);
            setAccessToken(res?.access);
            setRefreshToken(res?.refresh);
            axios.defaults.headers.common["Authorization"] = "Bearer " + accessToken;
            const tokenParts: string[] =res?.access.split('.');

            if (tokenParts.length >= 2) {
                const payload = JSON.parse(atob(tokenParts[1]));

                const id: number = payload.user_id || 0;
                const username: string = payload.username || '';
                const firstName: string = payload.first_name || '';
                const lastName: string = payload.last_name || '';
                const isStaff: boolean = payload.is_staff || false;

                const user: User = {
                    id: id,
                    username: username,
                    firstName: firstName,
                    lastName: lastName,
                    isStaff: isStaff
                };

                setUser(user);
            }
            navigate('');
        }
    };

    const logout = () : void => {
        localStorage.clear();
        setAccessToken(null);
        setRefreshToken(null);
        navigate('/login');
    }

    const isTokenValid = async (): Promise<boolean> => {
        if (accessToken) {
            const res = await validateAccessToken(accessToken);
            if (!res) {
                if (refreshToken) {
                    await refreshAccessToken(refreshToken)
                        .then((res) => {
                            if (res) {
                                localStorage.setItem('accessToken', res?.access);
                                setAccessToken(res?.access);
                                axios.defaults.headers.common["Authorization"] = "Bearer " + accessToken;
                                return true;
                            }
                            else return false;
                        })
                        .catch(() => {
                            localStorage.clear();
                            setAccessToken(null);
                            setRefreshToken(null)
                            return false;
                        });
                }
                else return false;
            }
            else {
                axios.defaults.headers.common["Authorization"] = "Bearer " + accessToken;
                return true;
            }
            return true;
        }
        else return false;
    };

    const isLoggedIn = async (): Promise<boolean> => {
        if (accessToken) {
            const isValid = await isTokenValid();
            return isValid;
        }
        else return false;
    }

    return (
        <UserContext.Provider value={{ login, logout, isTokenValid, isLoggedIn, accessToken, refreshToken, user }}>
            { isReady ? children : null }
        </UserContext.Provider>
    );
};

export const useAuth = () => React.useContext(UserContext);
