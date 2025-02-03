import React, { useState } from 'react';
import { IoMenuOutline, IoCloseOutline, IoFilterOutline } from "react-icons/io5";

const MobileControls = ({ 
  sidebarOpen, 
  setSidebarOpen, 
  filterOpen, 
  setFilterOpen 
}) => {
  return (
    <div className="mobile-controls">
      <button
        className="mobile-button categories-button"
        onClick={() => {
          setSidebarOpen(!sidebarOpen);
          if (filterOpen) setFilterOpen(false);
        }}
      >
        {sidebarOpen ? <IoCloseOutline size={20} /> : <IoMenuOutline size={20} />}
        <span>Κατηγορίες</span>
      </button>

      <button
        className="mobile-button filters-button"
        onClick={() => {
          setFilterOpen(!filterOpen);
          if (sidebarOpen) setSidebarOpen(false);
        }}
      >
        {filterOpen ? <IoCloseOutline size={20} /> : <IoFilterOutline size={20} />}
        <span>Φίλτρα</span>
      </button>
    </div>
  );
};

export default MobileControls;