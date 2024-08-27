import React, { useState, useEffect } from 'react';
import './InternalNumbers.css';
import Sidebar from '../components/Sidebar'; 
import Header from '../components/Header'; 
import icon1 from '../assets/icons/newsearch.png';
import ReactPaginate from 'react-paginate';
import NavigateBefore from '@mui/icons-material/NavigateBefore';
import NavigateNext from '@mui/icons-material/NavigateNext';

const InternalNumbers = () => {
  const [phoneNumbers, setPhoneNumbers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [selectedDepartmentID, setSelectedDepartmentID] = useState('');
  const [searchTelephone, setSearchTelephone] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const ApiEndpoint = `${import.meta.env.VITE_APP_API_URL}`;
    fetch(ApiEndpoint + '/user/get-mudurlukler')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        if (data.success) {
          setDepartments(data.data.mudurlukler); 
        } else {
          console.error('Failed to fetch departments:', data.message);
        }
      })
      .catch((error) => console.error('Error fetching departments:', error));
  }, []);

  const fetchPage = async (page) => {
    setLoading(true);
    const ApiEndpoint = `${import.meta.env.VITE_APP_API_URL}`;
    try {
      const response = await fetch(`${ApiEndpoint}/user/get-phone-numbers?page=${page}`, {
        method: "POST",
        body: JSON.stringify({ 
          name: searchName, 
          departman: selectedDepartmentID,  
          phone: searchTelephone
        }), 
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      console.log('API Response:', data);
  
      if (data.success) {
        const telephonesData = data.data.telephones;
        console.log('Telephones Data:', telephonesData);
  
        // Access totalPages from the pagination object
        const totalPages = telephonesData.pagination?.total_page;
  
        if (telephonesData && typeof totalPages === 'number') {
          setPhoneNumbers(telephonesData.result || []);
          setTotalPages(totalPages);
          console.log('Total Pages:', totalPages);
        } else {
          console.error('Total pages not found or invalid format');
        }
      } else {
        console.error('Failed to fetch phone numbers:', data.message);
      }
    } catch (error) {
      console.error('Error fetching phone numbers:', error);
    } finally {
      setLoading(false);
    }
  };
  
  

  useEffect(() => {
    fetchPage(currentPage);
  }, [searchName, selectedDepartmentID, searchTelephone, currentPage]);

  const handlePageChange = (data) => {
    setCurrentPage(data.selected + 1);  // ReactPaginate uses 0-indexed pages, so add 1
  };

  return (
    <div className="internal-numbers-page">
      <Header />  
      <div className="internal-numbers-container">
        <Sidebar /> 
        <div className="internal-numbers-content">
          <div className="search-bar-container">
            <img src={icon1} alt="Search" className="search-icon" />
            <input
              type="text"
              placeholder="İsim ara.."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="search-bar"
            />
            <select
              value={selectedDepartmentID}
              onChange={(e) => setSelectedDepartmentID(e.target.value)}
              className="search-bar"
            >
              <option value="">Müdürlük seçiniz...</option>
              {departments.map((department) => (
                <option key={department.id} value={department.id}>
                  {department.birim}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Numara ara.."
              value={searchTelephone}
              onChange={(e) => setSearchTelephone(e.target.value)}
              className="search-bar"
            />
          </div>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <table className="internal-numbers-table">
              <thead>
                <tr>
                  <th>İsim</th>
                  <th>Müdürlük</th>
                  <th>Numara</th>
                </tr>
              </thead>
              <tbody>
                {phoneNumbers.length > 0 ? (
                  phoneNumbers.map((phone) => (
                    <tr key={phone.id}>
                      <td>{phone.description}</td>
                      <td>{phone?.department?.birim}</td>
                      <td>{phone.phone}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3">Sonuç yok</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
          <ReactPaginate
            previousLabel={<NavigateBefore />}
            nextLabel={<NavigateNext />}
            breakLabel={"..."}
            pageCount={totalPages || 1}  
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={handlePageChange}
            containerClassName={"pagination"}
            pageClassName={"page-item"}
            pageLinkClassName={"page-link"}
            previousClassName={"page-item"}
            previousLinkClassName={"page-link"}
            nextClassName={"page-item"}
            nextLinkClassName={"page-link"}
            breakClassName={"page-item"}
            breakLinkClassName={"page-link"}
            activeClassName={"active"}
          />
        </div>
      </div>
    </div>
  );
};

export default InternalNumbers;
