package com.ncomics.backend.modules.follow;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ncomics.backend.modules.follow.entity.Follow;

public interface FollowRepository extends JpaRepository<Follow, Long> {
}

