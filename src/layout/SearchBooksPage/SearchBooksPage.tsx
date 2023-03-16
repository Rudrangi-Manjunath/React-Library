import { useEffect, useState } from "react";
import BookModel from "../../models/BookModel";
import { Pagination } from "../HomePage/Utils/Pagination";
import { SpinnerLoading } from "../HomePage/Utils/SpinnerLoading";
import { SearchBook } from "./components/SearchBook";

export const SearchBooksPage = () => {
  const [books, setBooks] = useState<BookModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [httpError, setHttpError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalAmountofBooks, setTotalAmountofBooks] = useState(0);
  const [booksPerPage] = useState(5);
  const [search, setSearch] = useState("");
  const [searchUrl, setSearchUrl] = useState("");
  const [categorySelection, setCategorySelection] = useState("Book Category");

  useEffect(() => {
    const fetchBooks = async () => {
      const baseUrl: string = "http://localhost:8080/api/books";
      let url: string = " ";
      if (searchUrl === "") {
        url = `${baseUrl}?page=${currentPage}&size=${booksPerPage}`;
      } else {
        let searchWithPage = searchUrl.replace("<pageNumber>", `${currentPage - 1}`);
        url = `${baseUrl}${searchWithPage}`;
      }
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Something went wrong!");
      }
      const responseJson = await response.json();
      const responseData = responseJson._embedded.books;

      setTotalPages(responseJson.page.totalPages);
      setTotalAmountofBooks(responseJson.page.totalElements);

      const loadedBooks: BookModel[] = [];
      for (const key in responseData) {
        loadedBooks.push({
          id: responseData[key].id,
          title: responseData[key].title,
          author: responseData[key].author,
          description: responseData[key].description,
          copies: responseData[key].copies,
          copiesAvailable: responseData[key].copiesAvailable,
          category: responseData[key].category,
          img: responseData[key].img,
        });
      }
      setBooks(loadedBooks);
      setLoading(false);
    };
    fetchBooks().catch((err: any) => {
      setLoading(false);
      setHttpError(err.message);
    });

    window.scrollTo(0, 0);
  }, [currentPage, searchUrl]);
  if (loading) {
    return <SpinnerLoading />;
  }

  if (httpError) {
    return (
      <div className="container mt-5">
        <p>{httpError}</p>
      </div>
    );
  }

  const searchHandleChange = () => {
    setCurrentPage(1);
    if (search === "") {
      setSearchUrl("");
    }
    else {
      setSearchUrl(`/search/findByTitleContaining?title=${search}&page=<pageNumber>&size=${booksPerPage}`)
    }
    setCategorySelection("Book Category");
  }

  const categoryField = (value: string) => {
    setCurrentPage(1);
    if (
      value.toLowerCase() === "fe" ||
      value.toLowerCase() === "be" ||
      value.toLowerCase() === "data" ||
      value.toLowerCase() === "devops"
    ) {
      setCategorySelection(value);
      setSearchUrl(`/search/findByCategory?category=${value}&page=<pageNumber>&size=${booksPerPage}`)
    }
    else {
      setCategorySelection("All");
      setSearchUrl(`?page=<pageNumber>&size=${booksPerPage}`);
    }
  }

  const indexOfLastBook: number = currentPage * booksPerPage;
  const indexOfFirstBook: number = indexOfLastBook - booksPerPage;
  let lastItem = booksPerPage * currentPage <= totalAmountofBooks ?
    booksPerPage * currentPage : totalAmountofBooks;


  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };
  return (
    <div>
      <div className="container">
        <div>
          <div className="row mt-5">
            <div className="col-6">
              <div className="d-flex">
                <input
                  className="form-control me-2"
                  type="search"
                  placeholder="search"
                  aria-labelledby="search"
                  onChange={(e) => (setSearch(e.target.value))}
                />
                <button className="btn btn-outline-success" type="submit" onClick={() => searchHandleChange()}>
                  Search
                </button>
              </div>
            </div>
            <div className="col-4">
              <div className="dropdown">
                <button
                  className="btn btn-secondary dropdown-toggle"
                  type="button"
                  id="dropdownMenuButton1"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {categorySelection}
                </button>
                <ul
                  className="dropdown-menu"
                  aria-labelledby="dropdownMenuButton1"
                >
                  <li onClick={() => categoryField("All")}>
                    <a className="dropdown-item" href="#" >
                      All
                    </a>
                  </li>
                  <li onClick={() => categoryField("FE")}>
                    <a className="dropdown-item" href="#">
                      Front End
                    </a>
                  </li>
                  <li onClick={() => categoryField("BE")}>
                    <a className="dropdown-item" href="#">
                      Back End
                    </a>
                  </li>
                  <li onClick={() => categoryField("Data")}>
                    <a className="dropdown-item" href="#">
                      Data
                    </a>
                  </li>
                  <li onClick={() => categoryField("Devops")}>
                    <a className="dropdown-item" href="#">
                      DevOps
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          {
            totalAmountofBooks > 0 ?
              <>
                <div className="mt-3">
                  <h5>Number of results:{(totalAmountofBooks)}</h5>
                </div>
                <p>
                  {indexOfFirstBook + 1} to {lastItem} of {totalAmountofBooks} items: <br />
                </p>
                {books.map((book) => (
                  <SearchBook key={book.id} book={book} />
                ))}
              </>
              :
              <div className="m-5">
                <h3>Cant't find what you looking for?</h3>
                <a type="button" className="btn main-color btn-md px-4 me-md-2 fw-bold text-white"
                  href="#">Library Services</a>
              </div>
          }

          {
            totalPages > 1 &&
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              paginate={paginate}
            />
          }
        </div>
      </div>
    </div>
  );
};
