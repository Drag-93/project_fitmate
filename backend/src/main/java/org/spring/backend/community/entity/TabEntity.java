package org.spring.backend.community.entity;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Builder
@Setter
@Getter
@Table(name="tab_tb")
@AllArgsConstructor
@NoArgsConstructor
public class TabEntity {
  @Id
  @Column(name="tab_id")
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String tabName;

  @OneToMany(mappedBy = "tabEntity", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<CategoryEntity> categoryList = new ArrayList<>();
}
