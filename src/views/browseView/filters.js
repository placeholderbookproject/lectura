export const filterOptions = (type) => type==='texts'?textFilters:authorFilters;

const textFilters = [{label: 'Type', property: 'text_type' },
        {label: 'Language', property: 'text_language' },
/*{label: 'Publication Year', property: 'text_original_publication_year',values:[]},*/]

const authorFilters = [{label:'Positions', property:'author_positions'},
                        {label:'Language', property:'author_name_language'},
                        //{label:'Living Period', property:'author_birth_year'},
                        {label:'Birth City', property:'author_birth_city'},
                        {label:'Birth Country', property:'author_birth_country'},
                        {label:'Death City', property:'author_death_city'},
                        {label:'Death Country', property:'author_death_country'},
                        {label: 'Nationality', property:'author_nationality'}
                    ];