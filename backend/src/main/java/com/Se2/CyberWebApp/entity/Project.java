package com.Se2.CyberWebApp.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "project")
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String slug;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(length = 500)
    private String image;

    @Column(length = 500)
    private String technologies; 

    @Column(name = "github_url", length = 500)
    private String githubUrl;

    @Column(columnDefinition = "decimal(15,2) default '0.00'")
    private Double price = 0.0;

    @Column(name = "coin_price")
    private Integer coinPrice = 0;

    @Column(name = "currency_unit", length = 10)
    private String currencyUnit = "USD";

    private Integer views = 0;

    @Column(name = "rating_avg", columnDefinition = "decimal(3,2) default '0.00'")
    private Double ratingAvg = 0.0;

    @Column(name = "rating_count")
    private Integer ratingCount = 0;

    @Column(name = "code_file", length = 500)
    private String codeFile;

    @Column(name = "file_package", length = 500)
    private String filePackage;

    @Column(name = "demo_url", length = 500)
    private String demoUrl;

    @Column(name = "download_count")
    private Integer downloadCount = 0;

    @Column(name = "team_id")
    private String teamId;

    @Column(name = "published_at", length = 12)
    private String publishedAt;

    private Short status = 1;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id")
    private Category category;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Project() {}

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }

    public String getTechnologies() { return technologies; }
    public void setTechnologies(String technologies) { this.technologies = technologies; }

    public String getGithubUrl() { return githubUrl; }
    public void setGithubUrl(String githubUrl) { this.githubUrl = githubUrl; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public Integer getCoinPrice() { return coinPrice; }
    public void setCoinPrice(Integer coinPrice) { this.coinPrice = coinPrice; }

    public Integer getViews() { return views; }
    public void setViews(Integer views) { this.views = views; }

    public Double getRatingAvg() { return ratingAvg; }
    public void setRatingAvg(Double ratingAvg) { this.ratingAvg = ratingAvg; }

    public Integer getRatingCount() { return ratingCount; }
    public void setRatingCount(Integer ratingCount) { this.ratingCount = ratingCount; }

    public String getPublishedAt() { return publishedAt; }
    public void setPublishedAt(String publishedAt) { this.publishedAt = publishedAt; }

    public Short getStatus() { return status; }
    public void setStatus(Short status) { this.status = status; }

    public String getCodeFile() { return codeFile; }
    public void setCodeFile(String codeFile) { this.codeFile = codeFile; }

    public String getFilePackage() { return filePackage; }
    public void setFilePackage(String filePackage) { this.filePackage = filePackage; }

    public String getDemoUrl() { return demoUrl; }
    public void setDemoUrl(String demoUrl) { this.demoUrl = demoUrl; }

    public Integer getDownloadCount() { return downloadCount; }
    public void setDownloadCount(Integer downloadCount) { this.downloadCount = downloadCount; }

    public String getTeamId() { return teamId; }
    public void setTeamId(String teamId) { this.teamId = teamId; }

    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }

    public LocalDateTime getCreatedAt() { return createdAt; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}
