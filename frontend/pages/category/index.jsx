import CategoryList from "@/components/CategoryList";
import React, { useEffect, useState } from "react";

const Category = (props) => {
  const[categories, setCategories] =useState([])
  const url = process.env.NEXT_PUBLIC_BASEURL;
  
  const getCategories = async () => {
    const response = await fetch(`${url}/api/category-list/`);
    const res = await response.json();
    setCategories(res);
  };

  useEffect(() => {
    getCategories()
  }, [props])
  


  return <CategoryList categories={categories} />;
};

export default Category;
