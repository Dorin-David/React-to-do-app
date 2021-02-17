import './Filter.css'
function Filter(props){
    return (
        <div className='filter-wrapper'>
            <h4>Filter:</h4>
            <div id='green-filter' onClick={() => props.filterItems('green')} title='show green items' style={props.style('green')}></div>
           <div id='yellow-filter' onClick={() => props.filterItems('yellow')} title='show yellow items' style={props.style('yellow')}></div>
           <div id='red-filter' onClick={() => props.filterItems('red')} title='show red items' style={props.style('red')}></div>
           <div id='done-filter' onClick={() => props.filterItems('done')} title='show done items' style={props.style('done')}></div>
        </div>
    )
}

export default Filter
