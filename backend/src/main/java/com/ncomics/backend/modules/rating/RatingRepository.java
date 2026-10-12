package com.ncomics.backend.modules.rating;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ncomics.backend.modules.rating.entity.Rating;

public interface RatingRepository extends JpaRepository<Rating, Long> {
}

