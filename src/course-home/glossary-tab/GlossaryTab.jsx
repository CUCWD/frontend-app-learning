import React, {
  useState,
  useEffect,
  useContext,
  createContext,
} from 'react';

import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import './GlossaryTab.scss';

import {
  DropdownButton,
  Collapsible,
  Icon,
  ActionRow,
  SearchField,
  Pagination,
  Form,
} from '@edx/paragon';

import { ExpandLess, ExpandMore } from '@edx/paragon/icons';
import { getGlossaryData } from '../data/api';
import messages from './messages';

// Getting all necessary contexts and variables
export const CourseContext = createContext();
export const KeyTermContext = createContext();
const ListViewContext = createContext();
const queryParams = new URLSearchParams(window.location.search);
const scrolltoParam = queryParams.get('scrollTo');
const paginationLength = 15;

// Lists all resources
function ResourceList() {
  const { resources } = useContext(KeyTermContext);

  resources.sort((a, b) => (a.friendly_name > b.friendly_name ? 1 : -1));

  if (resources.length > 0) {
    return (
      <div className="ref-container flex-col">
        <b>References:</b>
        {
          resources.map(resource => (
            <p>
              <a key={resource.id} target="_blank" rel="noopener noreferrer" href={resource.resource_link}>{resource.friendly_name}</a>
            </p>
          ))
        }
      </div>
    );
  }
  return null;
}

// Lists all lessons
function Lessons() {
  const { lessons } = useContext(KeyTermContext);

  // Sorting list by module name then by lesson name
  lessons.sort((a, b) => {
    if (a.module_name === b.module_name) {
      if (a.lesson_name > b.lesson_name) { return 1; }
      return -1;
    }
    if (a.module_name > b.module_name) { return 1; }

    return -1;
  });

  if (lessons.length > 0) {
    return (
      <div className="lessons-container flex-col">
        <b>Lessons</b>
        {
            lessons.map(lesson => (
              <Lesson lesson={lesson} />
            ))
          }
      </div>
    );
  }
  return null;
}

// Gets a specific textbook
function Lesson({ lesson }) {
  const { courseId } = useContext(CourseContext);
  const encodedCourse = courseId.replace(' ', '+');
  return (
    <p>
      <a key={lesson.id} target="_blank" rel="noopener noreferrer" href={`http://localhost:2000/course/${encodedCourse}/${lesson.lesson_link}`}>
        {lesson.module_name}&gt;{lesson.lesson_name}&gt;{lesson.unit_name}
      </a> &nbsp; &nbsp;
    </p>
  );
}

// Gets a specific textbook
function Textbook({ textbook }) {
  const { courseId } = useContext(CourseContext);
  const assetId = courseId.replace('course', 'asset');

  const lmsTextbookLink = `http://localhost:18000/${assetId}+type@asset+block@${textbook.textbook_link}#page=${textbook.page_num}`;

  return (
    <p>
      <a target="_blank" rel="noopener noreferrer" href={lmsTextbookLink}> {textbook.chapter}, pg. {textbook.page_num} </a>
    </p>
  );
}

// Lists all textbooks
function TextbookList() {
  const { textbooks } = useContext(KeyTermContext);
  if (textbooks.length > 0) {
    return (
      <div className="textbook-container flex-col">
        <b>Textbooks</b>
        {
        textbooks.map(textbook => (
          <Textbook key={textbook.id} textbook={textbook} />
        ))
      }
      </div>
    );
  }
  return null;
}

// Lists all definitions
function DefinitionsList() {
  const { definitions } = useContext(KeyTermContext);
  if (definitions.length > 0) {
    return (
      <div className="definitions-container flex-col">
        <b>Definitions</b>
        {definitions.map((descr) => (
          <div className="definition">
            <p key={descr.id}>{descr.description}</p>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

// Refers to one key term.
function KeyTerm({ index }) {
  /* eslint-disable camelcase */
  const { key_name } = useContext(KeyTermContext);

  return (
    <div className="key-term-container">
      <Collapsible
        key={index}
        style={index % 2 ? { backgroundColor: '#d4d4d4' } : { backgroundColor: 'white' }}
        ref={function fn(ref) {
          if (ref != null && scrolltoParam === key_name) {
            window.scrollTo(0, ref.offsetTop);
            ref.open();
          }
        }}
        title={<b>{key_name}</b>}
        styling="card-lg"
        iconWhenOpen={<Icon src={ExpandLess} />}
        iconWhenClosed={<Icon src={ExpandMore} />}
      >
        <KeyTermData />
      </Collapsible>
    </div>
  );
  /* eslint-enable camelcase */
}

// All the data needed for a keyterm.
function KeyTermData() {
  return (
    <div className="key-term-info">
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
  const lessons = [];
  const newSet = new Set();

  termData.value.termData.filter((keyTerm) => keyTerm.lessons.forEach(lesson => {
    if (lessons.find(object => object.module_name === lesson.module_name) === undefined) { lessons.push(lesson); }
  }));

  lessons.sort((a, b) => (a.module_name > b.module_name ? 1 : -1));

  const handleChange = e => {
    filterModules.forEach(item => { newSet.add(item); });
    if (e.target.checked) { newSet.add(e.target.value); } else { newSet.delete(e.target.value); }
    return setFilterModules(newSet);
  };

  const buttontitle = filterModules.size > 0 ? `Filter Modules (${filterModules.size})` : 'Filter Modules';
  return (
    <DropdownButton id="dropdown-basic-button" title={buttontitle}>
      <Form.Group>
        <Form.CheckboxSet name="modules" onChange={handleChange}>
          {lessons.map(lesson => <Form.Checkbox value={lesson.module_name}>{lesson.module_name}</Form.Checkbox>)}
        </Form.CheckboxSet>
      </Form.Group>
    </DropdownButton>
  );
}

// Lists all keyterms
function KeyTermList() {
  const {
    filterModules, searchQuery, selectedPage, setPagination,
  } = useContext(ListViewContext);
  const { termData } = useContext(CourseContext);

  function paginate(termList, pageSize, pageNumber) {
    return termList.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
  }

  const displayTerms = termData
    .filter(keyTerm => (
      // First finds all keyterms that have been filtered for
      filterModules.size === 0
      || keyTerm.lessons.find(object => filterModules.has(object.module_name)) !== undefined)
      // Returns keyterms with names or definitions matching search query
      && (keyTerm.key_name.toString().toLowerCase().includes(searchQuery.toLowerCase())
          || keyTerm.definitions.find(object => object.description.toLowerCase()
            .includes(searchQuery.toLowerCase())) !== undefined))
    .sort((a, b) => {
      if (a.key_name < b.key_name) { return -1; }
      if (a.key_name > b.key_name) { return 1; }
      return 0;
    });

  setPagination(displayTerms.length / paginationLength);
  if (displayTerms.length === 0) { setPagination(0); }

  return (
    <div className="key-term_list">
      {displayTerms.length === 0 ? (<h3 className="filter-container">No Terms to Display...</h3>) : null}
      {paginate(displayTerms, paginationLength, selectedPage).map((keyTerm, index) => (
        <KeyTermContext.Provider value={keyTerm}>
          <KeyTerm index={index} key={displayTerms.id} />
        </KeyTermContext.Provider>
      ))}
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

  useEffect(() => {
    getGlossaryData(courseId)
      .then((keytermData) => setTermData(keytermData));
  }, []);

  return (
    <>
      {/* Header */}
      <div role="heading" aria-level="1" className="h2 my-3">
        {intl.formatMessage(messages.glossaryHeader)}
      </div>

      {/* Search Functions */}
      <ActionRow>
        <p>
          Displaying {pagination > 0 ? 1 + paginationLength * (selectedPage - 1) : 0}
          -
          {pagination * paginationLength < paginationLength
            ? parseInt(pagination * paginationLength, 10)
            : paginationLength * selectedPage}{' '}
          of {parseInt(pagination * paginationLength, 10)} items
        </p>
        <ActionRow.Spacer />

        <SearchField
          onSubmit={(value) => {
            setSearchQuery(value);
          }}
          onClear={() => setSearchQuery('')}
          placeholder="Search"
        />
        <ListViewContext.Provider value={{ filterModules, setFilterModules }}>
          <ModuleDropdown value={{ termData }} />
        </ListViewContext.Provider>
      </ActionRow>

      {/* List of Key Terms */}
      <CourseContext.Provider value={{ courseId, termData, setTermData }}>
        <ListViewContext.Provider value={{
          filterModules, setFilterModules, setPagination, searchQuery, selectedPage, expandAll, setExpandAll,
        }}
        >
          <KeyTermList />
        </ListViewContext.Provider>

        <div className="footer-container">
          {pagination === 0 ? null : (
            <Pagination
              paginationLabel="pagination navigation"
              pageCount={
                pagination > parseInt(pagination, 10)
                  ? parseInt(pagination, 10) + 1
                  : pagination
              }
              onPageSelect={(value) => setSelectedPage(value)}
            />
          )}
        </div>
      </CourseContext.Provider>

    </>
  );
}

GlossaryTab.propTypes = {
  intl: intlShape.isRequired,
};

Textbook.propTypes = {
  textbook: PropTypes.shape({
    textbook_link: PropTypes.string,
    chapter: PropTypes.string,
    page_num: PropTypes.number,
  }).isRequired,
};

Lesson.propTypes = {
  lesson: PropTypes.shape({
    id: PropTypes.number,
    lesson_link: PropTypes.string,
    module_name: PropTypes.string,
    lesson_name: PropTypes.string,
    unit_name: PropTypes.string,
  }).isRequired,
};

KeyTerm.propTypes = {
  index: PropTypes.number.isRequired,
};

export default injectIntl(GlossaryTab);
