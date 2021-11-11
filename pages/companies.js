import React, {useState,useEffect} from 'react'
import Layout from '../components/Layout'
import CompanyCard from '../components/CompanyCard'
import TopBarProgress from "react-topbar-progress-indicator";
import { categories,subcategories } from '../utils/categoriesAndSubcategories';
import Loader from '../components/Loader';

export default function companiesCards({data}) {
    
    const newData = data.values.filter((company,index)=> company.logo !==null)
    const [loading,setLoading]=useState(false)
    const [search,setSearch]=useState("")
    
    const [liveData,setLiveData]=useState( [] || newData);
    const [sorted,setSorted]=useState(false)
    const [selectedCategory,setSelectedCategory]=useState("All")
    const [selectedSubcategory,setSelectedSubcategory]=useState("All")
    
    TopBarProgress.config({
        barColors: {
          "0": "#fdb43e",
          "1.0": "#fdb43e"
        },
        shadowBlur: 5
      });
   
    const handleCompanyName= (text)=>{
    
   
                const result =  data.values.filter(
                    (company, index) =>
                    company.name.toLowerCase().includes(text)
                );
                setLiveData(result)


    }

   useEffect(()=>{
    
    if(sorted){ 
        liveData.sort((b, a) => a.name > b.name && 1 || -1) 
    } else {
        liveData.sort((a, b) => a.name > b.name && 1 || -1)
    }
   
    const handleImages = (url)=>{
        if(url.includes("https://drive.google.com")){
          return (`https://drive.google.com/thumbnail?id=${url.split('d/').pop().split('/view?usp=sharing')[0]}`)
        }else {
          return url
        }
        }

    const handleFilter = () => {
        

        if(selectedSubcategory === "All" && selectedCategory === "All"){
            setLoading(true)
            setLiveData(data.values)
        
            setLoading(false)
        }

        if (selectedCategory !=="All" && selectedSubcategory === "All"){
            setLoading(true)
            const result =  data.values.filter((company, index) =>company.parentCategorySlug===selectedCategory);
            setLiveData(result)
            setLoading(false)
        }

        if (selectedCategory !=="All" && selectedSubcategory !== "All"){
            setLoading(true)
            const result =  data.values.filter(
                (company, index) =>
                company.parentCategorySlug===
                    selectedCategory &&
                company.subcategory===selectedSubcategory
            );
            setLiveData(result)
            setLoading(false)
        }

        if (selectedCategory ==="All" && selectedSubcategory !== "All"){
            setLoading(true)
            const result =  data.values.filter(
                (company, index) =>
                company.subcategory===selectedSubcategory
            );
            setLiveData(result)
            setLoading(false)
        }

    }
    handleFilter()
   },[selectedCategory,selectedSubcategory,sorted])

   const handleLoading = ()=>{
       console.log("loading de companies",loading)
    setLoading(!loading)
  }

    return (
        <Layout>
        {loading && <TopBarProgress />}
        <section className="filter bg-white py-5">
            <div className="container">
                <div className="row">
                    <div className="col-md-3">
                    <select className="form-select" ariaLabel="Default select example" onChange={e => setSelectedCategory(e.target.value)} >
                        <option selected>Select a Category</option>
                        <option value="All">All</option>
                
                        {categories?categories.map((category,index)=>{
                            return (
                                <option value={category} >{category}</option>
                            )   
                        }):""}
                    </select>
                    </div>
                    <div className="col-md-3">
                    <select className="form-select" ariaLabel="Default select example" onChange={e => setSelectedSubcategory(e.target.value)}>
                        <option >Select a subcategory</option>
                        <option value="All">All</option>
                        {subcategories?subcategories.map((subcategory,index)=>{
                            return (
                                <option value={subcategory}>{subcategory}</option>
                            )   
                        }):""}
                    </select>
                    </div> {/* subcategory */}
                    <div className="col-md-3">
                    <div className="input-group">
                    <input type="text" class="form-control" id="inputGroupFile04" 
                    aria-describedby="inputGroupFileAddon04" aria-label="Upload" 
                    onChange={(e)=>handleCompanyName(e.target.value)}/>
                    <button className="btn border" type="button" id="inputGroupFileAddon04" onClick={handleCompanyName}>
                    <img src="https://cdn-icons-png.flaticon.com/512/107/107122.png" alt="" className="sm-icon"/>
                    </button>
                    </div>

                    </div>{/* search */}
                    <div className="col-md-3 d-flex justify-content-end align-items-center">
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value={sorted} id="flexCheckDefault" onClick={()=>setSorted(!sorted)}/>
                        <label class="form-check-label fw-bold" for="flexCheckDefault">
                            A-Z
                        </label>
                        </div> {/* form check */}
                        </div> 
                </div>
                {loading && "Loading"}
            </div> {/* container */}
        </section>

        <section className="cards my-5">
            <div className="container">
                <div className="card-container">
                    {liveData?liveData.map((company,index)=>{
                        return (
                            <CompanyCard company={company} index={index} handleLoading={handleLoading}/>
                        )
                    }):<Loader />}
                    {liveData.length <=0 && <h3 className="fw-bold">No Data</h3>}
                </div>
            </div>
        </section>

            
        </Layout>
    )
}


export async function getServerSideProps(context) {

    const res = await fetch(`https://apidaysserver-svmwd.ondigitalocean.app` || `http://localhost:5000`);
    const data = await res.json();
  
    if (!data) {
      return {
        notFound: true,
      };
    }
  
    return {
      props: { data },
    };
  }