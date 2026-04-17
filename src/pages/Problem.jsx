import ProblemList from '@/components/problems/ProblemList';
import ProblemSideBar from '@/components/problems/ProblemSideBar';
import React, { useCallback, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

const normalizePage = (rawValue) => {
  const parsed = Number.parseInt(rawValue, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
};

const normalizeDifficulty = (rawValue) => {
  const allowed = ['Easy', 'Medium', 'Hard'];
  return allowed.includes(rawValue) ? rawValue : '';
};

const Problems = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo(() => {
    const rawDifficulty = searchParams.get('difficulty') || '';
    return {
      name: searchParams.get('name') || '',
      tag: searchParams.get('tag') || '',
      difficulty: normalizeDifficulty(rawDifficulty),
    };
  }, [searchParams]);

  const page = useMemo(() => normalizePage(searchParams.get('page')), [searchParams]);

  useEffect(() => {
    const currentPage = searchParams.get('page');
    const normalizedPage = normalizePage(currentPage);
    const currentName = searchParams.get('name') || '';
    const currentTag = searchParams.get('tag') || '';
    const currentDifficulty = searchParams.get('difficulty') || '';
    const normalizedDifficulty = normalizeDifficulty(currentDifficulty);

    let isChanged = false;
    const nextParams = new URLSearchParams(searchParams);

    if (currentPage !== String(normalizedPage)) {
      nextParams.set('page', String(normalizedPage));
      isChanged = true;
    }

    if (currentName.trim() === '') {
      if (searchParams.has('name')) {
        nextParams.delete('name');
        isChanged = true;
      }
    }

    if (currentTag.trim() === '') {
      if (searchParams.has('tag')) {
        nextParams.delete('tag');
        isChanged = true;
      }
    }

    if (currentDifficulty && !normalizedDifficulty) {
      nextParams.delete('difficulty');
      isChanged = true;
    }

    if (!isChanged) {
      return;
    }

    setSearchParams(nextParams, { replace: true });
  }, [searchParams, setSearchParams]);

  const handleFilterChange = useCallback((newFilters) => {
    const nextFilters = {
      name: String(newFilters?.name || '').trim(),
      tag: String(newFilters?.tag || '').trim(),
      difficulty: normalizeDifficulty(String(newFilters?.difficulty || '')),
    };

    const currentName = searchParams.get('name') || '';
    const currentTag = searchParams.get('tag') || '';
    const currentDifficulty = normalizeDifficulty(searchParams.get('difficulty') || '');

    const isSameFilters =
      nextFilters.name === currentName &&
      nextFilters.tag === currentTag &&
      nextFilters.difficulty === currentDifficulty;

    if (isSameFilters) {
      return;
    }

    const nextParams = new URLSearchParams(searchParams);

    if (nextFilters.name) nextParams.set('name', nextFilters.name);
    else nextParams.delete('name');

    if (nextFilters.tag) nextParams.set('tag', nextFilters.tag);
    else nextParams.delete('tag');

    if (nextFilters.difficulty) nextParams.set('difficulty', nextFilters.difficulty);
    else nextParams.delete('difficulty');

    nextParams.set('page', '1');
    if (nextParams.toString() !== searchParams.toString()) {
      setSearchParams(nextParams);
    }
  }, [searchParams, setSearchParams]);

  const handlePageChange = useCallback((nextPage) => {
    const normalizedPage = normalizePage(String(nextPage || '1'));
    if (normalizedPage === page) {
      return;
    }

    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('page', String(normalizedPage));
    if (nextParams.toString() !== searchParams.toString()) {
      setSearchParams(nextParams);
    }
  }, [page, searchParams, setSearchParams]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <ProblemList
              filters={filters}
              page={page}
              onPageChange={handlePageChange}
            />
          </div>
          <div className="lg:col-span-1">
            <ProblemSideBar
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Problems;