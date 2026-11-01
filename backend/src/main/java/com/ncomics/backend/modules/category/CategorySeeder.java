package com.ncomics.backend.modules.category;

import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.ncomics.backend.modules.category.entity.Category;

@Component
public class CategorySeeder implements CommandLineRunner {

    private static final List<Seed> DEFAULTS = List.of(
            new Seed("Hành động", "hanh-dong"),
            new Seed("Hài hước", "hai-huoc"),
            new Seed("Kinh dị", "kinh-di"),
            new Seed("Tiên hiệp", "tien-hiep"),
            new Seed("Huyền huyễn", "huyen-huyen"),
            new Seed("Đô thị", "do-thi"),
            new Seed("Khoa huyễn", "khoa-huyen"),
            new Seed("Võng du", "vong-du"),
            new Seed("Ngôn tình", "ngon-tinh"),
            new Seed("Trọng sinh", "trong-sinh"),
            new Seed("Phiêu lưu", "phieu-luu"),
            new Seed("Bí ẩn", "bi-an"),
            new Seed("Học đường", "hoc-duong"),
            new Seed("Đời thường", "doi-thuong"),
            new Seed("Lịch sử", "lich-su"),
            new Seed("Thể thao", "the-thao")
    );

    private final CategoryRepository categoryRepository;

    public CategorySeeder(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    public void run(String... args) {
        if (categoryRepository.count() > 0) {
            return;
        }

        categoryRepository.saveAll(DEFAULTS.stream()
                .map(seed -> Category.builder()
                        .name(seed.name())
                        .slug(seed.slug())
                        .build())
                .toList());
    }

    private record Seed(String name, String slug) {
    }
}
