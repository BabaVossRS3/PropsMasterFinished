
import React, { useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import Header from '@/components/Header';
import Search from '@/components/Search';
import Footer from '@/components/Footer';

const SearchByOptions = () => {
    const [searchParam] = useSearchParams();
    const navigate = useNavigate();
    const category = searchParam.get('category');
    const typeoflist = searchParam.get('typeoflist');
    const price = searchParam.get('price');

    useEffect(() => {
        redirectToAggelies();
    }, [category, typeoflist, price])

    const redirectToAggelies = () => {
        // Construct the base URL
        let url = '/aggelies';

        // Create an object to store the query parameters
        const queryParams = new URLSearchParams();

        // Add filters to query parameters if they exist
        if (category) {
            queryParams.append('category', category);
        }
        if (typeoflist) {
            queryParams.append('typeoflist', typeoflist);
        }
        if (price) {
            queryParams.append('price', price);
        }

        // Add query parameters to URL if any exist
        const queryString = queryParams.toString();
        if (queryString) {
            url += `?${queryString}`;
        }

        // Navigate to the Aggelies page with the filters
        navigate(url);
    };

    return (
        <div>
            <Header />
            <div className="p-16 search-options flex justify-center">
                <Search />
            </div>
            <Footer />
        </div>
    )
}

export default SearchByOptions