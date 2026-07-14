'use client'

import { useSearchQuery } from '@/state/api';
import React, { useState } from 'react'
import { debounce } from 'lodash';

const Search = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const { data: searchResults, isLoading, isError } = useSearchQuery(searchTerm, {
        skip: searchTerm.length < 3
    });

    const handleSearch = debounce

  return (
    <div>page</div>
  )
}

export default Search