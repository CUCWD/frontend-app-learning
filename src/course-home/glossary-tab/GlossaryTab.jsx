import React, { createContext } from 'react';
import { useState, useEffect, useContext } from 'react';
import { useSelector } from 'react-redux';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import './GlossaryTab.scss';

import messages from './messages';

import {
  DropdownButton,
  Collapsible,
  Button,
  Icon,
  ActionRow,
  SearchField,
  Pagination,
  Form
} from '@edx/paragon';

import { ExpandLess, ExpandMore } from '@edx/paragon/icons';

// Getting all necessary contexts and variables
export const CourseContext = createContext();
export const KeyTermContext = createContext();
const ListViewContext = createContext();
const queryParams = new URLSearchParams(window.location.search);
const scrolltoParam = queryParams.get('scrollTo');

// Lists all resources
function ResourceList() {
  const { resources } = useContext(KeyTermContext);
  return (
    <div className='ref-container flex-col'>
      <b>References:</b>
      {resources.map(function (resource) {
        return (
          <p key={resource.id}>
            <a href={resource.resource_link}>{resource.friendly_name}</a>
          </p>
        );
      })}
    </div>
  );
}

// Lists all lessons
function Lessons() {
  const { lessons } = useContext(KeyTermContext);
  return (
    <div className='lessons-container flex-col'>
      <b>Lessons</b>
      { 
      lessons.map(function (lesson) {
        return (
          <Lesson key={lesson.id} lesson={lesson} />
        );
      }) 
      }
    </div>
  );
}

// Gets a specific textbook
function Lesson({ lesson }) {
  const { courseId } = useContext(CourseContext);
  const encodedCourse = courseId.replace(" ", "+");
  return (
    <p>
      <a href={`http://localhost:2000/course/${encodedCourse}/${lesson.lesson_link}`}> Lesson {lesson.lesson_number}: {lesson.lesson_name} <br/> Module: {lesson.module_name} </a> &nbsp; &nbsp;
    </p>
  );
}

// Gets a specific textbook
function Textbook({ textbook }) {
  const [variant, setVariant] = useState('primary');
  const [buttonText, setButtonText] = useState('Copy Link');

  const { courseId } = useContext(CourseContext);
  const assetId = courseId.replace('course', 'asset');

  const lmsTextbookLink = `http://localhost:18000/${assetId}+type@asset+block@${textbook.textbook_link}#page=${textbook.page_num}`;

  return (
    <p>
      {textbook.chapter}, pg. {textbook.page_num} &nbsp; &nbsp;
      <Button
        variant={variant}
        size='inline'
        title='Copy Link'
        onClick={() => {
          navigator.clipboard.writeText(lmsTextbookLink);
          setVariant('light');
          setButtonText('Copied');
        }}
      >
        {' '}
        {buttonText}{' '}
      </Button>
    </p>
  );
}

// Lists all textbooks
function TextbookList() {
  const { textbooks } = useContext(KeyTermContext);
  return (
    <div className='textbook-container flex-col'>
      <b>Textbooks</b>
      {textbooks.map(function (textbook) {
        return (
          <Textbook key={textbook.id} textbook={textbook} />
        );
      })}
    </div>
  );
}

// Lists all definitions
function DefinitionsList() {
  const { definitions } = useContext(KeyTermContext);
  return (
    <div className='definitions-container flex-col'>
      <b>Definitions</b>
      {definitions.map(function (descr) {
        return (
          <div className='definition'>
            <p>{descr.description}</p>
          </div>
        );
      })}
    </div>
  );
}

// Refers to one key term.
function KeyTerm() {
  const { key_name } = useContext(KeyTermContext);

  return (
    <div className='key-term-container'>
      <Collapsible ref={function(ref) {
          if (ref != null && scrolltoParam == key_name) {
            window.scrollTo(0, ref.offsetTop);
            ref.open();
          }
        }}
        title={<b>{key_name}</b>}
        styling='card-lg'
        iconWhenOpen={<Icon src={ExpandLess} />}
        iconWhenClosed={<Icon src={ExpandMore} />}
      >
        <KeyTermData />
      </Collapsible>
    </div>
  );
}

// All the data needed for a keyterm.
function KeyTermData() {
  return (
    <div className='key-term-info'>
      <DefinitionsList />
      <TextbookList />
      <Lessons />
      <ResourceList />
    </div>
  );
}

// Filter modules button
function ModuleDropdown(termData) {
  const { filterModules, setFilterModules } = useContext(ListViewContext);
  var lessons = []
  var newSet = new Set()
  termData["value"]["termData"].filter(function (keyTerm) {
    keyTerm.lessons.forEach(lesson => {
      if (lessons.find(function(object) {return object.module_name === lesson.module_name}) === undefined) lessons.push(lesson)
    });
  })

  const handleChange = e => {
    filterModules.forEach(item => {newSet.add(item)});
    e.target.checked ? newSet.add(e.target.value) : newSet.delete(e.target.value);
    setFilterModules(newSet);
  }

  return (
    <DropdownButton id="dropdown-basic-button" title="Filter Modules">
      <Form.Group>
        <Form.CheckboxSet name="modules" onChange={handleChange}>
        {lessons.map(lesson => <Form.Checkbox value={lesson.module_name}>{lesson.module_name}</Form.Checkbox>)}
        </Form.CheckboxSet>
      </Form.Group>
    </DropdownButton>
  )
}

// Lists all keyterms
function KeyTermList() {
  const { filterModules, searchQuery, selectedPage, setPagination } = useContext(ListViewContext);
  const { termData } = useContext(CourseContext);

  function paginate(termList, page_size, page_number) {
    return termList.slice((page_number - 1) * page_size, page_number * page_size);
  }
    
  const displayTerms = termData
    .filter(function (keyTerm) {
      console.log(filterModules);
      if (filterModules.size == 0 || keyTerm.lessons.find(function(object) {return filterModules.has(object.module_name)}) !== undefined)
        return keyTerm.key_name
          .toString()
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
    })
    .sort(function compare(a, b) {
      if (a.key_name < b.key_name) return -1;
      if (a.key_name > b.key_name) return 1;
      return 0;
    });
  
  setPagination(displayTerms.length / 50);
  if (displayTerms.length === 0) setPagination(0);

  return (
    <div className='key-term_list'>
      {displayTerms.length === 0 ? (<h3 className='filter-container'>No Terms to Display...</h3>) : null}
      {paginate(displayTerms, 50, selectedPage).map(function (keyTerm) {
      return (
        <KeyTermContext.Provider value={keyTerm}>
          <KeyTerm key={displayTerms.id} />
        </KeyTermContext.Provider>
      );
      })}
    </div>
  );
}

// Refers to the whole glossary page
function GlossaryTab({ intl }) {
  const { courseId } = useSelector(state => state.courseHome);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterModules, setFilterModules] = useState(new Set());
  const [termData, setTermData] = useState([]);
  const [selectedPage, setSelectedPage] = useState(1);
  const [pagination, setPagination] = useState();
  const [expandAll, setExpandAll] = useState(false);

  // Fetch data from edx_keyterms_api
  const getTerms=()=> {
    const encodedCourse = courseId.replace(" ", "+");
    const restUrl = `http://localhost:18500/api/v1/course_terms?course_id=${encodedCourse}`;
    fetch(restUrl, {
      method: "GET"
    })
    .then((response) => response.json())
    .then((jsonData) => setTermData(jsonData))
    .catch((error) => {
      console.error(error);
    });
  }

  useEffect(()=>{
    getTerms();
  },[]);

  return (
    <>
      {/* Header */}
      <div role="heading" aria-level="1" className="h2 my-3">
        {intl.formatMessage(messages.glossaryHeader)}
      </div>

      {/* Search Functions */}
      <ActionRow>
        {
        <p>
          Displaying {pagination > 0 ? 1 + 50 * (selectedPage - 1) : 0}
                      -
                      {pagination * 50 < 50
                        ? parseInt(pagination * 50)
                        : 50 * selectedPage}{' '}
                      of {parseInt(pagination * 50)} items
        </p>
        }
        <ActionRow.Spacer />
        
        <SearchField
                    onSubmit={(value) => {
                      setSearchQuery(value);
                    }}
                    onClear={() => setSearchQuery("")
                    }
                    placeholder='Search'
        />
        <ListViewContext.Provider value = {{filterModules, setFilterModules}}>
          <ModuleDropdown value={{termData}}/>
        </ListViewContext.Provider>
      </ActionRow>
      
      {/* List of Key Terms */}
      <CourseContext.Provider value={{ courseId, termData, setTermData }}>
        <ListViewContext.Provider value = {{filterModules, setFilterModules, setPagination, searchQuery, selectedPage, expandAll, setExpandAll}}>
            <KeyTermList /> 
        </ListViewContext.Provider>
      
      {
        <div className='footer-container'>
          {pagination === 0 ? null : (
            <Pagination
              paginationLabel='pagination navigation'
              pageCount={
                pagination > parseInt(pagination)
                  ? parseInt(pagination) + 1
                  : pagination
              }
              onPageSelect={(value) => setSelectedPage(value)}
            />
          )}
        </div>
      }
      </CourseContext.Provider>
      
    </>
  );
}

GlossaryTab.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(GlossaryTab);