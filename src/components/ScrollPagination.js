import React from 'react';
import { Link } from 'react-router';
import $ from 'jquery';

class ScrollPagination extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			pages : [
				{selector: "section1", offset: 0, active: false},
				{selector: "section2", offset: 0, active: false},
				{selector: "section3", offset: 0, active: false},
				{selector: "section4", offset: 0, active: false},
				{selector: "section5", offset: 0, active: false},
			]
		}
	}

	getOffsets(offsets) {
		var windowOffset = $(window).scrollTop();
		var scrollSection = offsets[0];
		var index = 0;
		
		if(windowOffset > 0) {
			for(var i in offsets) {
				offsets[i].active = false;
				if(windowOffset >= offsets[i].offset) {
					scrollSection = offsets[i];
					index = i;
				}
			}
		}

		offsets[index].active = true;
		return {offsets: offsets, scrollSection: scrollSection};
	}

	getOffsetsScroll(offsets, up) {
		var scrollSection = offsets[0];
		var index = 0, offset_length = offsets.length;
		for(var i in offsets) {
			var active = offsets[i].active;
			if(active == true) {
				if(up) {
					var next_index = parseInt(i) + 1;
					if(next_index > offset_length - 1) {
						next_index = offset_length - 1;
					}
				} else {
					var next_index = parseInt(i) - 1;
					if(next_index < 0) {
						next_index = 0;
					}
				}
				index = next_index;
			}
		}
		
		//clear active offsets
		for(var i in offsets) {
			offsets[i].active = false;
		}

		offsets[index].active = true;
		scrollSection = offsets[index];

		return {offsets: offsets, scrollSection: scrollSection};
	}

	componentDidMount() {
		var component = this;
		$(document).ready(function(event) {
			var offsets = component.state.pages;
			for(var i in offsets) {
				if($('.m2homepage > .m2page_row[data-scroll="'+offsets[i].selector+'"]').length > 0) {
					offsets[i].offset = $('.m2homepage > .m2page_row[data-scroll="'+offsets[i].selector+'"]').offset().top;
				}
			}
			
			var data = component.getOffsets(offsets);
			offsets = data.offsets;
			$('html, body').animate({scrollTop: data.scrollSection.offset}, 300);
			component.setState({pages: offsets});

			var currentOffset = $(window).scrollTop();
			var offset = 0;
			window.targetScrollTo = false;

			$(window).scroll(function(event) {
				event.preventDefault();
				if(!window.targetScrollTo){
					var data = component.getOffsets(component.state.pages);
					if(data.scrollSection.selector != offset) {
						offset = data.scrollSection.selector;
						component.setState({pages: data.offsets});
					}
				}
			});

			$(window).resize(function() {
				var offsets = component.state.pages;
				for(var i in offsets) {
					if($('.m2homepage > .m2page_row[data-scroll="'+offsets[i].selector+'"]').length > 0) {
						offsets[i].offset = $('.m2homepage > .m2page_row[data-scroll="'+offsets[i].selector+'"]').offset().top;
					}
				}
				var data = component.getOffsets(offsets);
				offsets = data.offsets;
				component.setState({pages: offsets});
			});
		});

		

		

		
	}

	paginationHandleClick(event) {
		var target = event.target;
		var index = target.attributes['data-select'].value;
		var pages = this.state.pages;

		for(var i in pages) {
			pages[i].active = false;
			
			if(pages[i].selector == index) {
				window.targetScrollTo = true;
				pages[i].active = true;
				$('html, body').animate({scrollTop: pages[i].offset}, 300, function(){
					window.targetScrollTo = false;
				});
			}
		}
		this.setState({pages: pages});
		
		
	}

	render() {
		let sectionPagination = [];
		this.state.pages.map(item => sectionPagination.push(<Link className={item.active ? "active" : ""} key={'pagination_' + item.selector} href="#" data-select={item.selector} onClick={this.paginationHandleClick.bind(this)}></Link>));
		return (
			<div className="m2section_pagination hide_mobile">{sectionPagination}</div>
		);
	}
}

export default ScrollPagination;