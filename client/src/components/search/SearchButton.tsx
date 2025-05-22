import React from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSearch } from '@/context/SearchContext';

interface SearchButtonProps {
  className?: string;
  style?: React.CSSProperties;
  iconSize?: number;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export function SearchButton({ 
  className, 
  style,
  iconSize = 16,
  variant = 'ghost',
  size = 'sm'
}: SearchButtonProps) {
  const { openSearch } = useSearch();
  
  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      style={style}
      onClick={openSearch}
    >
      <Search size={iconSize} className="mr-1" />
      <span>Search</span>
    </Button>
  );
}