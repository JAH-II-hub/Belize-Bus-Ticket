// Belize Bus Ticket System - Reusable UI Components
// Functions to create and render common UI components

// ===== Modal Component =====

/**
 * Create a modal dialog
 * @param {object} options - Modal options
 * @returns {HTMLElement} Modal element
 */
function createModal(options = {}) {
    const {
        id = 'modal-' + Date.now(),
        title = '',
        content = '',
        size = 'medium', // small, medium, large
        showClose = true,
        onClose = null
    } = options;

    const modal = document.createElement('div');
    modal.className = `modal modal-${size}`;
    modal.id = id;
    modal.innerHTML = `
        <div class="modal-overlay" data-modal-close></div>
        <div class="modal-container">
            <div class="modal-header">
                ${title ? `<h3 class="modal-title">${escapeHtml(title)}</h3>` : ''}
                ${showClose ? '<button class="modal-close" data-modal-close>&times;</button>' : ''}
            </div>
            <div class="modal-body">
                ${typeof content === 'string' ? content : content.outerHTML}
            </div>
            <div class="modal-footer"></div>
        </div>
    `;

    // Add close handlers
    modal.querySelectorAll('[data-modal-close]').forEach(el => {
        el.addEventListener('click', () => {
            if (onClose) onClose();
            closeModal(modal);
        });
    });

    return modal;
}

/**
 * Open modal
 * @param {HTMLElement|string} modal - Modal element or selector
 */
function openModal(modal) {
    const element = typeof modal === 'string' ? document.querySelector(modal) : modal;
    if (element) {
        element.classList.add('modal-open');
        document.body.style.overflow = 'hidden';
    }
}

/**
 * Close modal
 * @param {HTMLElement|string} modal - Modal element or selector
 */
function closeModal(modal) {
    const element = typeof modal === 'string' ? document.querySelector(modal) : modal;
    if (element) {
        element.classList.remove('modal-open');
        document.body.style.overflow = '';
    }
}

/**
 * Add button to modal footer
 * @param {HTMLElement} modal - Modal element
 * @param {string} text - Button text
 * @param {function} onClick - Click handler
 * @param {string} variant - Button variant (primary, secondary, danger)
 */
function addModalButton(modal, text, onClick, variant = 'primary') {
    const footer = modal.querySelector('.modal-footer');
    if (footer) {
        const button = document.createElement('button');
        button.className = `btn btn-${variant}`;
        button.textContent = text;
        button.addEventListener('click', onClick);
        footer.appendChild(button);
    }
}

// ===== Card Component =====

/**
 * Create a card component
 * @param {object} options - Card options
 * @returns {HTMLElement} Card element
 */
function createCard(options = {}) {
    const {
        title = '',
        subtitle = '',
        content = '',
        footer = '',
        image = null,
        className = '',
        clickable = false,
        onClick = null
    } = options;

    const card = document.createElement('div');
    card.className = `card ${className}${clickable ? ' card-clickable' : ''}`;
    
    if (clickable && onClick) {
        card.addEventListener('click', onClick);
    }

    let html = '';
    
    if (image) {
        html += `<img src="${escapeHtml(image)}" alt="${escapeHtml(title)}" class="card-image">`;
    }
    
    if (title || subtitle) {
        html += '<div class="card-header">';
        if (subtitle) {
            html += `<span class="card-subtitle">${escapeHtml(subtitle)}</span>`;
        }
        if (title) {
            html += `<h3 class="card-title">${escapeHtml(title)}</h3>`;
        }
        html += '</div>';
    }
    
    if (content) {
        html += `<div class="card-body">${typeof content === 'string' ? content : ''}</div>`;
    }
    
    if (footer) {
        html += `<div class="card-footer">${typeof footer === 'string' ? footer : ''}</div>`;
    }

    card.innerHTML = html;
    return card;
}

// ===== Bus Card Component =====

/**
 * Create a bus card for display
 * @param {object} bus - Bus data object
 * @param {object} locations - Locations map
 * @param {function} onBook - Book button click handler
 * @returns {HTMLElement} Bus card element
 */
function createBusCard(bus, locations = {}, onBook = null) {
    const departureLocation = locations[bus.departureLocationId] || { name: 'Unknown' };
    const arrivalLocation = locations[bus.arrivalLocationId] || { name: 'Unknown' };
    
    const card = document.createElement('div');
    card.className = 'bus-card';
    card.innerHTML = `
        <div class="bus-card-header">
            <h3>${escapeHtml(bus.name)}</h3>
            <span class="bus-type-badge type-${bus.type.toLowerCase()}">${escapeHtml(bus.type)}</span>
        </div>
        <div class="bus-card-body">
            <div class="bus-route">
                <div class="route-stop">
                    <span class="stop-time">${formatTime(bus.departureTime)}</span>
                    <span class="stop-name">${escapeHtml(departureLocation.name)}</span>
                </div>
                <div class="route-arrow">→</div>
                <div class="route-stop">
                    <span class="stop-time">${formatTime(bus.arrivalTime)}</span>
                    <span class="stop-name">${escapeHtml(arrivalLocation.name)}</span>
                </div>
            </div>
            <div class="bus-details">
                <div class="detail-item">
                    <span class="detail-label">Bus Number</span>
                    <span class="detail-value">${escapeHtml(bus.busNumber)}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Available Seats</span>
                    <span class="detail-value">${bus.availableSeats}/${bus.seatCapacity}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Price</span>
                    <span class="detail-value price">${formatCurrency(bus.pricePerSeat || 0)}</span>
                </div>
            </div>
        </div>
        <div class="bus-card-footer">
            <button class="btn btn-primary book-btn" ${bus.availableSeats <= 0 ? 'disabled' : ''}>
                ${bus.availableSeats <= 0 ? 'Sold Out' : 'Book Now'}
            </button>
        </div>
    `;

    if (onBook && bus.availableSeats > 0) {
        card.querySelector('.book-btn').addEventListener('click', () => onBook(bus));
    }

    return card;
}

// ===== Ticket Card Component =====

/**
 * Create a ticket card for display
 * @param {object} ticket - Ticket data object
 * @param {object} options - Display options
 * @returns {HTMLElement} Ticket card element
 */
function createTicketCard(ticket, options = {}) {
    const {
        showActions = false,
        onConfirm = null,
        onCancel = null
    } = options;

    const card = document.createElement('div');
    card.className = 'ticket-card';
    card.innerHTML = `
        <div class="ticket-header">
            <div class="ticket-reference">
                <span class="reference-label">Booking Reference</span>
                <span class="reference-value">${escapeHtml(ticket.bookingReference)}</span>
            </div>
            ${createStatusBadge(ticket.status)}
        </div>
        <div class="ticket-body">
            <div class="ticket-row">
                <span class="label">Bus:</span>
                <span class="value">${escapeHtml(ticket.busName || 'N/A')}</span>
            </div>
            <div class="ticket-row">
                <span class="label">Route:</span>
                <span class="value">${escapeHtml(ticket.destination)}</span>
            </div>
            <div class="ticket-row">
                <span class="label">Travel Date:</span>
                <span class="value">${formatDate(ticket.travelDate)}</span>
            </div>
            <div class="ticket-row">
                <span class="label">Seats:</span>
                <span class="value">${ticket.numberOfSeats} ${ticket.seatNumbers ? `(${escapeHtml(ticket.seatNumbers)})` : ''}</span>
            </div>
            <div class="ticket-row">
                <span class="label">Total Price:</span>
                <span class="value price">${formatCurrency(ticket.totalPrice)}</span>
            </div>
            ${ticket.isRoundTrip ? `
            <div class="ticket-row">
                <span class="label">Return Date:</span>
                <span class="value">${formatDate(ticket.returnDate)}</span>
            </div>
            ` : ''}
        </div>
        ${showActions ? `
        <div class="ticket-footer">
            ${onConfirm && ticket.status === 'Booked' ? `
            <button class="btn btn-success confirm-btn">Confirm Ticket</button>
            ` : ''}
            ${onCancel && ['Booked', 'Confirmed'].includes(ticket.status) ? `
            <button class="btn btn-danger cancel-btn">Cancel Ticket</button>
            ` : ''}
        </div>
        ` : ''}
    `;

    if (onConfirm) {
        const confirmBtn = card.querySelector('.confirm-btn');
        if (confirmBtn) {
            confirmBtn.addEventListener('click', () => onConfirm(ticket));
        }
    }

    if (onCancel) {
        const cancelBtn = card.querySelector('.cancel-btn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => onCancel(ticket));
        }
    }

    return card;
}

// ===== Table Component =====

/**
 * Create a responsive table
 * @param {array} columns - Column definitions
 * @param {array} data - Data rows
 * @param {object} options - Table options
 * @returns {HTMLElement} Table element
 */
function createTable(columns, data = [], options = {}) {
    const {
        className = '',
        striped = true,
        hover = true,
        onRowClick = null,
        emptyMessage = 'No data available'
    } = options;

    const table = document.createElement('div');
    table.className = `table-container ${className}`;
    
    let html = '<table class="table';
    if (striped) html += ' table-striped';
    if (hover) html += ' table-hover';
    html += '">';
    
    // Header
    html += '<thead><tr>';
    columns.forEach(col => {
        html += `<th style="width: ${col.width || 'auto'}">${escapeHtml(col.header)}</th>`;
    });
    html += '</tr></thead>';
    
    // Body
    html += '<tbody>';
    if (data.length === 0) {
        html += `<tr><td colspan="${columns.length}" class="empty-message">${emptyMessage}</td></tr>`;
    } else {
        data.forEach((row, index) => {
            html += '<tr';
            if (onRowClick) html += ' data-row-index="' + index + '"';
            html += '>';
            columns.forEach(col => {
                const value = col.render ? col.render(row[col.key], row, index) : row[col.key];
                html += `<td>${value !== undefined ? value : ''}</td>`;
            });
            html += '</tr>';
        });
    }
    html += '</tbody></table>';
    
    table.innerHTML = html;

    if (onRowClick) {
        table.querySelectorAll('tbody tr[data-row-index]').forEach(tr => {
            tr.addEventListener('click', () => {
                const index = parseInt(tr.dataset.rowIndex);
                onRowClick(data[index], index, tr);
            });
        });
    }

    return table;
}

// ===== Form Components =====

/**
 * Create a form group
 * @param {string} id - Field ID
 * @param {string} label - Field label
 * @param {string} type - Input type
 * @param {object} options - Additional options
 * @returns {HTMLElement} Form group element
 */
function createFormGroup(id, label, type = 'text', options = {}) {
    const {
        required = false,
        placeholder = '',
        value = '',
        disabled = false,
        readonly = false,
        helpText = '',
        error = '',
        className = ''
    } = options;

    const group = document.createElement('div');
    group.className = `form-group ${className}`;
    
    let html = `
        <label for="${escapeHtml(id)}" class="form-label">
            ${escapeHtml(label)}${required ? '<span class="required">*</span>' : ''}
        </label>
    `;

    if (type === 'textarea') {
        html += `<textarea id="${escapeHtml(id)}" name="${escapeHtml(id)}" 
            ${placeholder ? `placeholder="${escapeHtml(placeholder)}"` : ''}
            ${disabled ? 'disabled' : ''}
            ${readonly ? 'readonly' : ''}
            ${required ? 'required' : ''}
            class="form-control">${escapeHtml(value)}</textarea>`;
    } else if (type === 'select') {
        html += `<select id="${escapeHtml(id)}" name="${escapeHtml(id)}" 
            ${disabled ? 'disabled' : ''}
            ${required ? 'required' : ''}
            class="form-control">`;
        
        if (options.options) {
            options.options.forEach(opt => {
                html += `<option value="${escapeHtml(opt.value)}"${opt.value === value ? ' selected' : ''}>${escapeHtml(opt.label)}</option>`;
            });
        }
        html += '</select>';
    } else {
        html += `<input type="${escapeHtml(type)}" id="${escapeHtml(id)}" name="${escapeHtml(id)}" 
            ${placeholder ? `placeholder="${escapeHtml(placeholder)}"` : ''}
            ${value ? `value="${escapeHtml(value)}"` : ''}
            ${disabled ? 'disabled' : ''}
            ${readonly ? 'readonly' : ''}
            ${required ? 'required' : ''}
            class="form-control">`;
    }

    if (helpText) {
        html += `<small class="form-help">${escapeHtml(helpText)}</small>`;
    }

    if (error) {
        html += `<div class="form-error">${escapeHtml(error)}</div>`;
        group.classList.add('has-error');
    }

    group.innerHTML = html;
    return group;
}

// ===== Search/Filter Component =====

/**
 * Create a search filter bar
 * @param {object} options - Filter options
 * @returns {HTMLElement} Filter bar element
 */
function createFilterBar(options = {}) {
    const {
        searchPlaceholder = 'Search...',
        filters = [],
        onSearch = null,
        onFilterChange = null
    } = options;

    const filterBar = document.createElement('div');
    filterBar.className = 'filter-bar';
    
    let html = '<div class="filter-search">';
    html += `
        <input type="text" class="search-input" placeholder="${escapeHtml(searchPlaceholder)}">
        <button class="search-btn" aria-label="Search">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
            </svg>
        </button>
    `;
    html += '</div>';

    if (filters.length > 0) {
        html += '<div class="filter-options">';
        filters.forEach(filter => {
            html += `
                <div class="filter-option">
                    <label>${escapeHtml(filter.label)}</label>
                    <select name="${escapeHtml(filter.name)}" class="filter-select">`;
            
            filter.options.forEach(opt => {
                html += `<option value="${escapeHtml(opt.value)}">${escapeHtml(opt.label)}</option>`;
            });
            
            html += '</select></div>';
        });
        html += '</div>';
    }

    filterBar.innerHTML = html;

    if (onSearch) {
        filterBar.querySelector('.search-input').addEventListener('input', (e) => {
            onSearch(e.target.value);
        });
    }

    if (onFilterChange) {
        filterBar.querySelectorAll('.filter-select').forEach(select => {
            select.addEventListener('change', (e) => {
                onFilterChange(e.target.name, e.target.value);
            });
        });
    }

    return filterBar;
}

// ===== Pagination Component =====

/**
 * Create pagination controls
 * @param {object} pagination - Pagination data
 * @param {function} onPageChange - Page change handler
 * @returns {HTMLElement} Pagination element
 */
function createPagination(pagination, onPageChange) {
    const { page, totalPages, total, limit } = pagination;
    
    const nav = document.createElement('nav');
    nav.className = 'pagination';
    
    let html = '<ul class="pagination-list">';
    
    // Previous button
    html += `<li class="pagination-item${page <= 1 ? ' disabled' : ''}">
        <button class="pagination-btn" ${page <= 1 ? 'disabled' : ''} data-page="${page - 1}">Previous</button>
    </li>`;
    
    // Page numbers
    const maxVisible = 5;
    let startPage = Math.max(1, page - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);
    
    if (endPage - startPage < maxVisible - 1) {
        startPage = Math.max(1, endPage - maxVisible + 1);
    }
    
    if (startPage > 1) {
        html += `<li class="pagination-item"><button class="pagination-btn" data-page="1">1</button></li>`;
        if (startPage > 2) {
            html += '<li class="pagination-item disabled"><span>...</span></li>';
        }
    }
    
    for (let i = startPage; i <= endPage; i++) {
        html += `<li class="pagination-item${i === page ? ' active' : ''}">
            <button class="pagination-btn" data-page="${i}"${i === page ? ' aria-current="page"' : ''}>${i}</button>
        </li>`;
    }
    
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            html += '<li class="pagination-item disabled"><span>...</span></li>';
        }
        html += `<li class="pagination-item"><button class="pagination-btn" data-page="${totalPages}">${totalPages}</button></li>`;
    }
    
    // Next button
    html += `<li class="pagination-item${page >= totalPages ? ' disabled' : ''}">
        <button class="pagination-btn" ${page >= totalPages ? 'disabled' : ''} data-page="${page + 1}">Next</button>
    </li>`;
    
    html += '</ul>';
    html += `<div class="pagination-info">Showing ${(page - 1) * limit + 1} to ${Math.min(page * limit, total)} of ${total} results</div>`;
    
    nav.innerHTML = html;
    
    nav.querySelectorAll('.pagination-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const newPage = parseInt(btn.dataset.page);
            if (newPage !== page && onPageChange) {
                onPageChange(newPage);
            }
        });
    });
    
    return nav;
}

// ===== Loading States =====

/**
 * Create loading skeleton
 * @param {string} type - Skeleton type (card, list, table)
 * @param {number} count - Number of skeletons
 * @returns {string} Skeleton HTML
 */
function createSkeleton(type = 'card', count = 3) {
    let html = '';
    
    switch (type) {
        case 'card':
            for (let i = 0; i < count; i++) {
                html += `
                    <div class="skeleton-card">
                        <div class="skeleton skeleton-title"></div>
                        <div class="skeleton skeleton-text"></div>
                        <div class="skeleton skeleton-text short"></div>
                        <div class="skeleton skeleton-button"></div>
                    </div>
                `;
            }
            break;
        case 'list':
            for (let i = 0; i < count; i++) {
                html += `
                    <div class="skeleton-list-item">
                        <div class="skeleton skeleton-avatar"></div>
                        <div class="skeleton-content">
                            <div class="skeleton skeleton-title short"></div>
                            <div class="skeleton skeleton-text"></div>
                        </div>
                    </div>
                `;
            }
            break;
        case 'table':
            html += '<tbody>';
            for (let i = 0; i < count; i++) {
                html += `
                    <tr class="skeleton-table-row">
                        <td><div class="skeleton skeleton-cell"></div></td>
                        <td><div class="skeleton skeleton-cell"></div></td>
                        <td><div class="skeleton skeleton-cell"></div></td>
                        <td><div class="skeleton skeleton-cell"></div></td>
                    </tr>
                `;
            }
            html += '</tbody>';
            break;
    }
    
    return html;
}

// Export components
window.Components = {
    createModal,
    openModal,
    closeModal,
    addModalButton,
    createCard,
    createBusCard,
    createTicketCard,
    createTable,
    createFormGroup,
    createFilterBar,
    createPagination,
    createSkeleton
};