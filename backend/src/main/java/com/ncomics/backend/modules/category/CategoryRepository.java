package com.ncomics.backend.modules.category;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ncomics.backend.modules.category.entity.Category;

public interface CategoryRepository extends JpaRepository<Category, Long> {
}

