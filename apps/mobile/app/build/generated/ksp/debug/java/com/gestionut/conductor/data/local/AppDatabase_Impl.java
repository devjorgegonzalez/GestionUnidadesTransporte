package com.gestionut.conductor.data.local;

import androidx.annotation.NonNull;
import androidx.room.DatabaseConfiguration;
import androidx.room.InvalidationTracker;
import androidx.room.RoomDatabase;
import androidx.room.RoomOpenHelper;
import androidx.room.migration.AutoMigrationSpec;
import androidx.room.migration.Migration;
import androidx.room.util.DBUtil;
import androidx.room.util.TableInfo;
import androidx.sqlite.db.SupportSQLiteDatabase;
import androidx.sqlite.db.SupportSQLiteOpenHelper;
import com.gestionut.conductor.data.local.dao.PuntoTrackingDao;
import com.gestionut.conductor.data.local.dao.PuntoTrackingDao_Impl;
import java.lang.Class;
import java.lang.Override;
import java.lang.String;
import java.lang.SuppressWarnings;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import javax.annotation.processing.Generated;

@Generated("androidx.room.RoomProcessor")
@SuppressWarnings({"unchecked", "deprecation"})
public final class AppDatabase_Impl extends AppDatabase {
  private volatile PuntoTrackingDao _puntoTrackingDao;

  @Override
  @NonNull
  protected SupportSQLiteOpenHelper createOpenHelper(@NonNull final DatabaseConfiguration config) {
    final SupportSQLiteOpenHelper.Callback _openCallback = new RoomOpenHelper(config, new RoomOpenHelper.Delegate(1) {
      @Override
      public void createAllTables(@NonNull final SupportSQLiteDatabase db) {
        db.execSQL("CREATE TABLE IF NOT EXISTS `puntos_tracking_locales` (`idPuntoCliente` TEXT NOT NULL, `viajeId` TEXT NOT NULL, `lat` REAL NOT NULL, `lng` REAL NOT NULL, `velocidadKmh` REAL NOT NULL, `precisionMetros` REAL NOT NULL, `capturadoEn` INTEGER NOT NULL, `sincronizado` INTEGER NOT NULL, PRIMARY KEY(`idPuntoCliente`))");
        db.execSQL("CREATE INDEX IF NOT EXISTS `index_puntos_tracking_locales_viajeId` ON `puntos_tracking_locales` (`viajeId`)");
        db.execSQL("CREATE INDEX IF NOT EXISTS `index_puntos_tracking_locales_viajeId_sincronizado` ON `puntos_tracking_locales` (`viajeId`, `sincronizado`)");
        db.execSQL("CREATE TABLE IF NOT EXISTS room_master_table (id INTEGER PRIMARY KEY,identity_hash TEXT)");
        db.execSQL("INSERT OR REPLACE INTO room_master_table (id,identity_hash) VALUES(42, '927767eb242cfd27dba07f0fb0fcc185')");
      }

      @Override
      public void dropAllTables(@NonNull final SupportSQLiteDatabase db) {
        db.execSQL("DROP TABLE IF EXISTS `puntos_tracking_locales`");
        final List<? extends RoomDatabase.Callback> _callbacks = mCallbacks;
        if (_callbacks != null) {
          for (RoomDatabase.Callback _callback : _callbacks) {
            _callback.onDestructiveMigration(db);
          }
        }
      }

      @Override
      public void onCreate(@NonNull final SupportSQLiteDatabase db) {
        final List<? extends RoomDatabase.Callback> _callbacks = mCallbacks;
        if (_callbacks != null) {
          for (RoomDatabase.Callback _callback : _callbacks) {
            _callback.onCreate(db);
          }
        }
      }

      @Override
      public void onOpen(@NonNull final SupportSQLiteDatabase db) {
        mDatabase = db;
        internalInitInvalidationTracker(db);
        final List<? extends RoomDatabase.Callback> _callbacks = mCallbacks;
        if (_callbacks != null) {
          for (RoomDatabase.Callback _callback : _callbacks) {
            _callback.onOpen(db);
          }
        }
      }

      @Override
      public void onPreMigrate(@NonNull final SupportSQLiteDatabase db) {
        DBUtil.dropFtsSyncTriggers(db);
      }

      @Override
      public void onPostMigrate(@NonNull final SupportSQLiteDatabase db) {
      }

      @Override
      @NonNull
      public RoomOpenHelper.ValidationResult onValidateSchema(
          @NonNull final SupportSQLiteDatabase db) {
        final HashMap<String, TableInfo.Column> _columnsPuntosTrackingLocales = new HashMap<String, TableInfo.Column>(8);
        _columnsPuntosTrackingLocales.put("idPuntoCliente", new TableInfo.Column("idPuntoCliente", "TEXT", true, 1, null, TableInfo.CREATED_FROM_ENTITY));
        _columnsPuntosTrackingLocales.put("viajeId", new TableInfo.Column("viajeId", "TEXT", true, 0, null, TableInfo.CREATED_FROM_ENTITY));
        _columnsPuntosTrackingLocales.put("lat", new TableInfo.Column("lat", "REAL", true, 0, null, TableInfo.CREATED_FROM_ENTITY));
        _columnsPuntosTrackingLocales.put("lng", new TableInfo.Column("lng", "REAL", true, 0, null, TableInfo.CREATED_FROM_ENTITY));
        _columnsPuntosTrackingLocales.put("velocidadKmh", new TableInfo.Column("velocidadKmh", "REAL", true, 0, null, TableInfo.CREATED_FROM_ENTITY));
        _columnsPuntosTrackingLocales.put("precisionMetros", new TableInfo.Column("precisionMetros", "REAL", true, 0, null, TableInfo.CREATED_FROM_ENTITY));
        _columnsPuntosTrackingLocales.put("capturadoEn", new TableInfo.Column("capturadoEn", "INTEGER", true, 0, null, TableInfo.CREATED_FROM_ENTITY));
        _columnsPuntosTrackingLocales.put("sincronizado", new TableInfo.Column("sincronizado", "INTEGER", true, 0, null, TableInfo.CREATED_FROM_ENTITY));
        final HashSet<TableInfo.ForeignKey> _foreignKeysPuntosTrackingLocales = new HashSet<TableInfo.ForeignKey>(0);
        final HashSet<TableInfo.Index> _indicesPuntosTrackingLocales = new HashSet<TableInfo.Index>(2);
        _indicesPuntosTrackingLocales.add(new TableInfo.Index("index_puntos_tracking_locales_viajeId", false, Arrays.asList("viajeId"), Arrays.asList("ASC")));
        _indicesPuntosTrackingLocales.add(new TableInfo.Index("index_puntos_tracking_locales_viajeId_sincronizado", false, Arrays.asList("viajeId", "sincronizado"), Arrays.asList("ASC", "ASC")));
        final TableInfo _infoPuntosTrackingLocales = new TableInfo("puntos_tracking_locales", _columnsPuntosTrackingLocales, _foreignKeysPuntosTrackingLocales, _indicesPuntosTrackingLocales);
        final TableInfo _existingPuntosTrackingLocales = TableInfo.read(db, "puntos_tracking_locales");
        if (!_infoPuntosTrackingLocales.equals(_existingPuntosTrackingLocales)) {
          return new RoomOpenHelper.ValidationResult(false, "puntos_tracking_locales(com.gestionut.conductor.data.local.entity.PuntoTrackingLocalEntity).\n"
                  + " Expected:\n" + _infoPuntosTrackingLocales + "\n"
                  + " Found:\n" + _existingPuntosTrackingLocales);
        }
        return new RoomOpenHelper.ValidationResult(true, null);
      }
    }, "927767eb242cfd27dba07f0fb0fcc185", "433ce02742ede0266052610a2f08e4bf");
    final SupportSQLiteOpenHelper.Configuration _sqliteConfig = SupportSQLiteOpenHelper.Configuration.builder(config.context).name(config.name).callback(_openCallback).build();
    final SupportSQLiteOpenHelper _helper = config.sqliteOpenHelperFactory.create(_sqliteConfig);
    return _helper;
  }

  @Override
  @NonNull
  protected InvalidationTracker createInvalidationTracker() {
    final HashMap<String, String> _shadowTablesMap = new HashMap<String, String>(0);
    final HashMap<String, Set<String>> _viewTables = new HashMap<String, Set<String>>(0);
    return new InvalidationTracker(this, _shadowTablesMap, _viewTables, "puntos_tracking_locales");
  }

  @Override
  public void clearAllTables() {
    super.assertNotMainThread();
    final SupportSQLiteDatabase _db = super.getOpenHelper().getWritableDatabase();
    try {
      super.beginTransaction();
      _db.execSQL("DELETE FROM `puntos_tracking_locales`");
      super.setTransactionSuccessful();
    } finally {
      super.endTransaction();
      _db.query("PRAGMA wal_checkpoint(FULL)").close();
      if (!_db.inTransaction()) {
        _db.execSQL("VACUUM");
      }
    }
  }

  @Override
  @NonNull
  protected Map<Class<?>, List<Class<?>>> getRequiredTypeConverters() {
    final HashMap<Class<?>, List<Class<?>>> _typeConvertersMap = new HashMap<Class<?>, List<Class<?>>>();
    _typeConvertersMap.put(PuntoTrackingDao.class, PuntoTrackingDao_Impl.getRequiredConverters());
    return _typeConvertersMap;
  }

  @Override
  @NonNull
  public Set<Class<? extends AutoMigrationSpec>> getRequiredAutoMigrationSpecs() {
    final HashSet<Class<? extends AutoMigrationSpec>> _autoMigrationSpecsSet = new HashSet<Class<? extends AutoMigrationSpec>>();
    return _autoMigrationSpecsSet;
  }

  @Override
  @NonNull
  public List<Migration> getAutoMigrations(
      @NonNull final Map<Class<? extends AutoMigrationSpec>, AutoMigrationSpec> autoMigrationSpecs) {
    final List<Migration> _autoMigrations = new ArrayList<Migration>();
    return _autoMigrations;
  }

  @Override
  public PuntoTrackingDao puntoTrackingDao() {
    if (_puntoTrackingDao != null) {
      return _puntoTrackingDao;
    } else {
      synchronized(this) {
        if(_puntoTrackingDao == null) {
          _puntoTrackingDao = new PuntoTrackingDao_Impl(this);
        }
        return _puntoTrackingDao;
      }
    }
  }
}
