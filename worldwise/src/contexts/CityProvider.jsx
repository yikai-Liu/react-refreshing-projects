/* eslint-disable react/prop-types */
import { createContext, useContext, useEffect, useState } from "react";

const BASE_URL = "http://localhost:9000";

const CityContext = createContext();

function CityProvider({ children }) {
  const [isloading, setIsloading] = useState(false);
  const [cities, setCities] = useState([]);

  useEffect(function () {
    async function fetchCities() {
      try {
        setIsloading(true);
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();
        setCities(data);
      } catch {
        alert("Something run in the fetch");
      } finally {
        setIsloading(false);
      }
    }
    fetchCities();
  }, []);

  return (
    <CityContext.Provider
      value={{
        isloading,
        cities,
      }}
    >
      {children}
    </CityContext.Provider>
  );
}

function useCity() {
  const context = useContext(CityContext);
  if (context === undefined) {
    throw new Error("Context is used out of scope");
  }
  return context;
}

export { CityProvider, useCity };
