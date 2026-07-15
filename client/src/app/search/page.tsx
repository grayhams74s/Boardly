'use client'

import { useSearchQuery } from '@/state/api';
import React, { useState } from 'react'
import { debounce } from 'lodash';

const Search = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const { data: searchResults, isLoading, isError } = useSearchQuery(searchTerm, {
        skip: searchTerm.length < 3
    });

    const handleSearch = debounce(
        (event: React.ChangeEvent<HTMLInputElement>) => {
          setSearchTerm(event.target.value);
        },
        500
      );

  return (
    <div className='bg-white'>
      <div>
        <input type="text" />
      </div>
    </div>
  )
}

export default Search