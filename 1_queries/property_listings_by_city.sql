select
properties.id, title, cost_per_night, 
avg(property_reviews.rating) as average_rating
from properties
left join property_reviews on property_id = properties.id
where city like '%couver%'
group by properties.id
having avg(property_reviews.rating) >= 4
order by cost_per_night
limit 10;