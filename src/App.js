import React, { useState, useMemo, useCallback, useEffect } from "react";
import './App.css';

const UserCard = React.memo(({ user }) => {
    return (
        <div className="user-card">
            <h4>{user.name}</h4>
            <p>{user.email}</p>
            <p>{user.address.city}</p>
        </div>
    );
});

const UserList = ({ users }) => {
    if (users.length === 0) {
        return <p>No users found.</p>;
    }
    return (
        <div>
            {users.map((user) => (
                <UserCard key={user.id} user={user} />
            ))}
        </div>
    );
};

const SearchBar = ({ searchTerm, onSearch, onClear, selectedCity, onCityChange, cities }) => {
    return (
        <div>
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => onSearch(e.target.value)}
                placeholder="Ieškoti pagal vardą"
            />
            <select value={selectedCity} onChange={(e) => onCityChange(e.target.value)}>
                <option value="">Visi miestai</option>
                {cities.map((city) => (
                    <option key={city} value={city}>{city}</option>
                ))}
            </select>
            <button onClick={onClear}>Clear</button>
        </div>
    );
};

const App = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCity, setSelectedCity] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch("https://jsonplaceholder.typicode.com/users");
                const data = await response.json();
                setUsers(data);
            } catch (error) {
                console.error("Failed to fetch users", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const cities = useMemo(() => {
        const uniqueCities = new Set(users.map(user => user.address.city));
        return Array.from(uniqueCities);
    }, [users]);

    const filteredUsers = useMemo(() => {
        return users.filter((user) => {
            const matchesName = user.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCity = selectedCity === "" || user.address.city === selectedCity;
            return matchesName && matchesCity;
        });
    }, [users, searchTerm, selectedCity]);

    const handleSearch = useCallback((value) => {
        setSearchTerm(value);
    }, []);

    const handleCityChange = useCallback((value) => {
        setSelectedCity(value);
    }, []);

    const handleClear = () => {
        setSearchTerm("");
        setSelectedCity("");
    };

    return (
        <div>
            <h2>Naudotojų paieška</h2>
            <SearchBar
                searchTerm={searchTerm}
                onSearch={handleSearch}
                onClear={handleClear}
                selectedCity={selectedCity}
                onCityChange={handleCityChange}
                cities={cities}
            />
            {loading ? <p>Loading...</p> : <UserList users={filteredUsers} />}
        </div>
    );
};

export default App;
